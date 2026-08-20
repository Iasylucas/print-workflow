import { prisma } from "@/config/prisma.js";
import { Prisma } from "@/generated/prisma/client.js";
import {
  invoiceListSelect,
  invoiceDetailSelect,
  InvoicesQuery,
  UpdateInvoiceInput,
  AddPaymentInput,
  UpdatePaymentInput,
  PaginatedInvoicesList,
} from "./invoices.types.js";

export class InvoicesRepository {
  async findAll(query: InvoicesQuery): Promise<PaginatedInvoicesList> {
    const {
      page,
      limit,
      search,
      status,
      clientId,
      isDelivered,
      sortBy,
      sortOrder,
      startDate,
      endDate,
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.InvoiceWhereInput = { deletedAt: null };

    if (status) where.paymentStatus = status;
    if (clientId) where.clientId = clientId;
    if (isDelivered !== undefined) where.isDelivered = isDelivered;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    if (search) {
      where.OR = [
        { number: { contains: search, mode: "insensitive" } },
        { client: { firstName: { contains: search, mode: "insensitive" } } },
        { client: { lastName: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        select: invoiceListSelect,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.invoice.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasMore,
        search,
        status,
        clientId,
        isDelivered,
        sortBy,
        sortOrder,
      },
    };
  }

  async findById(id: number) {
    return await prisma.invoice.findUnique({
      where: { id, deletedAt: null },
      select: invoiceDetailSelect,
    });
  }

  async update(id: number, data: UpdateInvoiceInput) {
    const updateData: any = { ...data };

    if (data.deposit !== undefined) {
      const current = await prisma.invoice.findUnique({
        where: { id },
        select: { total: true, deposit: true },
      });

      if (current) {
        const newDeposit = data.deposit;
        updateData.paymentStatus =
          newDeposit >= current.total
            ? "paid"
            : newDeposit > 0
              ? "partial"
              : "unpaid";
      }
    }

    return await prisma.invoice.update({
      where: { id, deletedAt: null },
      data: updateData,
      select: invoiceDetailSelect,
    });
  }

  async markAsDelivered(id: number) {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      select: {
        orders: {
          select: { id: true },
        },
      },
    });

    if (!invoice) throw new Error("Facture introuvable");

    const orderIds = invoice.orders.map((o) => o.id);

    if (orderIds.length > 0) {
      await prisma.order.updateMany({
        where: { id: { in: orderIds } },
        data: { status: "delivered" },
      });
    }

    return await prisma.invoice.update({
      where: { id },
      data: { isDelivered: true },
      select: invoiceDetailSelect,
    });
  }

  async addPayment(invoiceId: number, userId: string, data: AddPaymentInput) {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      select: { total: true, deposit: true },
    });

    if (!invoice) throw new Error("Facture introuvable");

    const newDeposit = invoice.deposit + data.amount;

    const payment = await prisma.payment.create({
      data: {
        invoiceId,
        amount: data.amount,
        method: data.method,
        reference: data.reference || null,
        receivedById: userId,
      },
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
    });

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        deposit: newDeposit,
        paymentStatus:
          newDeposit >= invoice.total
            ? "paid"
            : newDeposit > 0
              ? "partial"
              : "unpaid",
      },
    });

    return payment;
  }

  async deletePayment(paymentId: number) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      select: {
        invoiceId: true,
        amount: true,
        invoice: {
          select: {
            total: true,
            deposit: true,
          },
        },
      },
    });

    if (!payment) throw new Error("Paiement introuvable");

    const newDeposit = payment.invoice.deposit - payment.amount;

    await prisma.payment.delete({
      where: { id: paymentId },
    });

    await prisma.invoice.update({
      where: { id: payment.invoiceId },
      data: {
        deposit: newDeposit,
        paymentStatus:
          newDeposit >= payment.invoice.total
            ? "paid"
            : newDeposit > 0
              ? "partial"
              : "unpaid",
      },
    });
  }

  async softDelete(id: number) {
    return await prisma.invoice.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: invoiceDetailSelect,
    });
  }

  async restore(id: number) {
    return await prisma.invoice.update({
      where: { id },
      data: { deletedAt: null },
      select: invoiceDetailSelect,
    });
  }
}
