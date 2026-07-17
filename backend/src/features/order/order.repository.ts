import { prisma } from "@/config/prisma.js";
import { Prisma } from "@/generated/prisma/client.js";
import { orderFullSelect } from "./order.types.js";
import type {
  CreateBulkOrderInput,
  CreateSingleOrderLineInput,
} from "./order.types.js";

export class OrderRepository {
  async countInvoicesByMonth(year: number, month: number): Promise<number> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    return await prisma.invoice.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async countQuotesByMonth(year: number, month: number): Promise<number> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    return await prisma.quote.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  // order.repository.ts
  async countOrderLinesByMonth(year: number, month: number): Promise<number> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    return await prisma.order.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async createBulk(
    data: CreateBulkOrderInput,
    generatedNumber: string,
    orderReferences: string[],
    currentUserId: string,
    companyInfoId: number,
    calculatedTotal: number,
  ) {
    return await prisma.$transaction(async (tx) => {
      let createdInvoiceId: number | null = null;
      let createdQuoteId: number | null = null;

      if (data.documentType === "INVOICE") {
        const invoice = await tx.invoice.create({
          data: {
            number: generatedNumber,
            clientId: data.clientId,
            companyInfoId: companyInfoId,
            createdById: currentUserId,
            total: calculatedTotal,
            deposit: data.deposit,
            remaining: calculatedTotal - data.deposit,
            deliveryPlace: data.deliveryPlace,
            expectedDeliveryDate: data.expectedDeliveryDate,
            paymentStatus:
              data.deposit >= calculatedTotal
                ? "paid"
                : data.deposit > 0
                  ? "partial"
                  : "unpaid",
          },
        });
        createdInvoiceId = invoice.id;

        if (data.deposit > 0) {
          await tx.payment.create({
            data: {
              invoiceId: invoice.id,
              amount: data.deposit,
              method: data.paymentMethod || "CASH",
              reference: `Acompte POS ${generatedNumber}`,
              receivedById: currentUserId,
            },
          });
        }
      } else {
        const quote = await tx.quote.create({
          data: {
            number: generatedNumber,
            clientId: data.clientId,
            companyInfoId: companyInfoId,
            createdById: currentUserId,
            total: calculatedTotal,
            status: "pending",
          },
        });
        createdQuoteId = quote.id;
      }

      let lineIndex = 0;

      for (const line of data.lines) {
        const reference = orderReferences[lineIndex];
        if (!reference) {
          throw new Error(`Référence manquante pour la ligne ${lineIndex}`);
        }
        const createdOrder = await tx.order.create({
          data: {
            reference,
            designation: line.designation,
            clientId: data.clientId,
            invoiceId: createdInvoiceId,
            quoteId: createdQuoteId,
            productId: line.productId,
            dimensions: line.dimensions,
            label: line.label,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            createdById: currentUserId,
            status: "waiting_for_file",
          },
        });

        if (line.atelierNote && line.atelierNote.trim() !== "") {
          await tx.note.create({
            data: {
              text: line.atelierNote.trim(),
              userId: currentUserId,
              orderId: createdOrder.id,
            },
          });
        }

        lineIndex++;
      }

      return {
        documentType: data.documentType,
        documentNumber: generatedNumber,
        total: calculatedTotal,
      };
    });
  }

  async findOrderWithDetails(orderId: number) {
    return await prisma.order.findUnique({
      where: { id: orderId, deletedAt: null },
      select: {
        id: true,
        reference: true,
        designation: true,
        label: true,
        dimensions: true,
        clientId: true,
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        productId: true,
        product: {
          select: {
            id: true,
            name: true,
          },
        },
        quantity: true,
        unitPrice: true,
        status: true,
        invoiceId: true,
        invoice: {
          select: {
            number: true,
            total: true,
            deposit: true,
            remaining: true,
            paymentStatus: true,
            isDelivered: true,
            payments: {
              select: {
                id: true,
                amount: true,
                method: true,
                reference: true,
                date: true,
                receivedById: true,
                receivedBy: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
        notes: {
          take: 1, // ← seulement la première note
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            text: true,
            userId: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            createdAt: true,
          },
        },
        files: {
          select: {
            id: true,
            url: true,
            category: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // order.repository.ts
  async updateOrderFromPos(
    invoiceId: number,
    data: {
      deposit?: number;
      deliveryPlace?: string | null;
      expectedDeliveryDate?: Date | null;
    },
  ) {
    return await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        deposit: data.deposit,
        deliveryPlace: data.deliveryPlace,
        expectedDeliveryDate: data.expectedDeliveryDate,
      },
      select: {
        id: true,
        number: true,
        total: true,
        deposit: true,
        remaining: true,
        paymentStatus: true,
      },
    });
  }

  async updateOrderLines(lines: { orderId: number; data: any }[]) {
    const updates = lines.map(({ orderId, data }) =>
      prisma.order.update({
        where: { id: orderId },
        data,
      }),
    );
    return await prisma.$transaction(updates);
  }

  // order.repository.ts
  async getFirstNoteByOrderId(orderId: number) {
    return await prisma.note.findFirst({
      where: { orderId },
      orderBy: { createdAt: "asc" },
    });
  }

  async updateNote(noteId: number, data: { text: string }) {
    return await prisma.note.update({
      where: { id: noteId },
      data: { text: data.text },
    });
  }

  // order.repository.ts
  async addNote(orderId: number, userId: string, data: { text: string }) {
    return await prisma.note.create({
      data: {
        text: data.text,
        userId,
        orderId,
      },
      select: {
        id: true,
        text: true,
        userId: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        createdAt: true,
      },
    });
  }
}
