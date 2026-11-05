import { prisma } from "@/config/prisma.js";
import { Prisma } from "@/generated/prisma/client.js";
import { orderFullSelect } from "./order.types.js";
import type {
  CreateBulkOrderInput,
  CreateSingleOrderLineInput,
} from "./order.types.js";
import { InvoicesRepository } from "../invoices/invoices.repository.js";

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

  // order.repository.ts
  async create(data: {
    invoiceId: number;
    clientId: string;
    designation: string;
    label?: string | null;
    dimensions?: string | null;
    quantity: number;
    unitPrice: number;
    createdById: string;
    status: string;
  }) {
    return await prisma.order.create({
      data: {
        reference: `CMD-${Date.now()}`,
        invoiceId: data.invoiceId,
        clientId: data.clientId,
        designation: data.designation,
        label: data.label,
        dimensions: data.dimensions,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        createdById: data.createdById,
        status: data.status,
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
            // remaining: calculatedTotal - data.deposit,
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
        id: createdInvoiceId || createdQuoteId,
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
            // remaining: true,
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
  async findInvoiceWithFirstNote(invoiceId: number) {
    return await prisma.invoice.findUnique({
      where: { id: invoiceId, deletedAt: null },
      select: {
        id: true,
        number: true,
        date: true,
        clientId: true,
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        total: true,
        deposit: true,
        deliveryPlace: true,
        expectedDeliveryDate: true,
        isDelivered: true,
        paymentStatus: true,
        companyInfoId: true,
        companyInfo: {
          select: {
            nif: true,
            stat: true,
            mainAddress: true,
            secondaryAddress: true,
            logo: true,
            stamp: true,
            mobileMoneyNumbers: true,
            standardPhone: true,
            contactEmail: true,
            termsAndConditions: true,
            deliveryLeadTime: true,
            bankAccountHolder: true,
            bankBranch: true,
            bankCode: true,
            ribInfo: true,
          },
        },
        createdById: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true,
            payments: true,
          },
        },
        orders: {
          where: { deletedAt: null },
          select: {
            id: true,
            reference: true,
            designation: true,
            label: true,
            dimensions: true,
            quantity: true,
            unitPrice: true,
            status: true,
            clientId: true,
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            product: {
              select: {
                id: true,
                name: true,
              },
            },
            files: {
              select: {
                id: true,
                url: true,
                category: true,
              },
            },
            notes: {
              take: 1,
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
          },
        },
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
          orderBy: { date: "desc" },
        },
      },
    });
  }

  async findInvoicePayments(invoiceId: number) {
    return await prisma.invoice.findUnique({
      where: { id: invoiceId, deletedAt: null },
      select: {
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
          orderBy: { date: "desc" },
        },
      },
    });
  }

  // order.repository.ts
  // async updateOrderFromPos(
  //   invoiceId: number,
  //   data: {
  //     // deposit?: number;
  //     deliveryPlace?: string | null;
  //     expectedDeliveryDate?: Date | null;
  //   },
  // ) {
  //   return await prisma.invoice.update({
  //     where: { id: invoiceId },
  //     data: {
  //       // deposit: data.deposit,
  //       deliveryPlace: data.deliveryPlace,
  //       expectedDeliveryDate: data.expectedDeliveryDate,
  //     },
  //     select: {
  //       id: true,
  //       number: true,
  //       total: true,
  //       deposit: true,
  //       // remaining: true,
  //       paymentStatus: true,
  //     },
  //   });
  // }

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

  // order.repository.ts
  async updateOrderFromPosTransaction(
    invoiceId: number,
    newTotal: number,
    data: {
      deliveryPlace?: string | null;
      expectedDeliveryDate?: Date | null;
      lines?: any[];
    },
    userId: string,
    clientId: string,
  ) {
    return await prisma.$transaction(async (tx) => {
      // ============================================================
      // 1. METTRE À JOUR LA FACTURE
      // ============================================================
      // 1. Récupérer la facture actuelle avec deposit
      const currentInvoice = await tx.invoice.findUnique({
        where: { id: invoiceId, deletedAt: null },
        select: { deposit: true, paymentStatus: true },
      });

      // 2. Calculer le nouveau statut de paiement
      let newPaymentStatus = currentInvoice?.paymentStatus;

      if (newTotal !== undefined && currentInvoice) {
        if (newTotal === currentInvoice.deposit) {
          newPaymentStatus = "paid";
        } else if (newTotal > currentInvoice.deposit) {
          newPaymentStatus = "partial";
        } else {
          newPaymentStatus = "unpaid";
        }
      }

      // 3. Mettre à jour
      await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          total: newTotal,
          deliveryPlace: data.deliveryPlace,
          expectedDeliveryDate: data.expectedDeliveryDate,
          paymentStatus: newPaymentStatus, // ← Ajouté
        },
      });

      // ============================================================
      // 2. GÉRER LES LIGNES DE COMMANDE
      // ============================================================
      const createdOrderIds: { [key: number]: number } = {};

      if (data.lines && data.lines.length > 0) {
        // 2a. Supprimer les commandes qui ne sont plus dans le payload
        const currentOrderIds = data.lines
          .map((line) => line.orderId)
          .filter((id) => id !== undefined && id !== null);

        if (currentOrderIds.length > 0) {
          await tx.order.updateMany({
            where: {
              invoiceId,
              id: { notIn: currentOrderIds },
              deletedAt: null,
            },
            data: { deletedAt: new Date() },
          });
        }

        // 2b. Mettre à jour ou créer les lignes
        for (let i = 0; i < data.lines.length; i++) {
          const line = data.lines[i];

          if (line.orderId) {
            // Mettre à jour une commande existante
            await tx.order.update({
              where: { id: line.orderId, deletedAt: null },
              data: {
                productId: line.productId,
                designation: line.designation,
                label: line.label,
                dimensions: line.dimensions,
                quantity: line.quantity,
                unitPrice: line.unitPrice,
              },
            });
            // Stocker l'ID existant
            createdOrderIds[i] = line.orderId;
          } else {
            // Créer une nouvelle commande
            const created = await tx.order.create({
              data: {
                reference: `CMD-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                invoiceId,
                clientId,
                designation: line.designation,
                productId: line.productId,
                label: line.label,
                dimensions: line.dimensions,
                quantity: line.quantity,
                unitPrice: line.unitPrice,
                createdById: userId,
                status: "waiting_for_file",
              },
            });
            // Stocker le nouvel ID
            createdOrderIds[i] = created.id;
          }
        }
      }

      // ============================================================
      // 3. GÉRER LES NOTES (UNE PAR COMMANDE, UNIQUEMENT LA PREMIÈRE)
      // ============================================================
      if (data.lines && data.lines.length > 0) {
        for (let i = 0; i < data.lines.length; i++) {
          const line = data.lines[i];
          const orderId = createdOrderIds[i];

          if (orderId) {
            // Récupérer la première note existante
            const existingNote = await tx.note.findFirst({
              where: { orderId },
              orderBy: { createdAt: "asc" },
            });

            if (line.atelierNote && line.atelierNote.trim() !== "") {
              // ✅ Note non vide → créer ou mettre à jour
              if (existingNote) {
                await tx.note.update({
                  where: { id: existingNote.id },
                  data: { text: line.atelierNote.trim() },
                });
              } else {
                await tx.note.create({
                  data: {
                    text: line.atelierNote.trim(),
                    userId,
                    orderId,
                  },
                });
              }
            } else {
              // ✅ Note vide → supprimer si elle existe
              if (existingNote) {
                await tx.note.delete({
                  where: { id: existingNote.id },
                });
              }
              // Si pas de note et pas de texte → rien à faire
            }
          }
        }
      }

      // ============================================================
      // 4. RETOURNER LA FACTURE MIS À JOUR
      // ============================================================
      return await tx.invoice.findUnique({
        where: { id: invoiceId },
        select: {
          id: true,
          number: true,
          total: true,
          deposit: true,
          paymentStatus: true,
          isDelivered: true,
          clientId: true,
          orders: true,
          payments: true,
        },
      });
    });
  }
}
