import { prisma } from "@/config/prisma.js";

export class AssistantRepository {
  async countOrdersByStatus(status: string) {
    return prisma.order.count({
      where: { status, deletedAt: null },
    });
  }

  async findOrderByReference(reference: string) {
    return prisma.order.findFirst({
      where: { reference, deletedAt: null },
      select: {
        reference: true,
        designation: true,
        status: true,
        quantity: true,
        unitPrice: true,
        dimensions: true,
        label: true,
        createdAt: true,
        client: {
          select: { firstName: true, lastName: true, phone: true },
        },
        invoice: {
          select: { number: true, paymentStatus: true },
        },
        createdBy: {
          select: { firstName: true, lastName: true },
        },
      },
    });
  }

  async getOrderStatusHistory(reference: string) {
    return prisma.orderStatusHistory.findMany({
      where: { order: { reference } },
      select: {
        createdAt: true,
        fromStatus: true,
        toStatus: true,
        changedBy: {
          select: { firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  }

  async getRevenueByMonth(month: number, year: number) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);

    const result = await prisma.payment.aggregate({
      where: {
        deletedAt: null,
        date: { gte: start, lte: end },
      },
      _sum: { amount: true },
      _count: { _all: true },
    });

    return {
      total: result._sum.amount ?? 0,
      count: result._count._all,
      month,
      year,
    };
  }

  async getUnpaidInvoices() {
    const [count, aggregate] = await Promise.all([
      prisma.invoice.count({
        where: {
          deletedAt: null,
          paymentStatus: { in: ["unpaid", "partial"] },
        },
      }),
      prisma.invoice.aggregate({
        where: {
          deletedAt: null,
          paymentStatus: { in: ["unpaid", "partial"] },
        },
        _sum: { total: true, deposit: true },
      }),
    ]);

    const total = aggregate._sum.total ?? 0;
    const deposit = aggregate._sum.deposit ?? 0;

    return {
      count,
      totalInvoiced: total,
      totalPaid: deposit,
      remainingToCollect: total - deposit,
    };
  }

  async getPendingQuotes() {
    const [count, aggregate] = await Promise.all([
      prisma.quote.count({
        where: { deletedAt: null, status: "pending" },
      }),
      prisma.quote.aggregate({
        where: { deletedAt: null, status: "pending" },
        _sum: { total: true },
      }),
    ]);

    return {
      count,
      totalAmount: aggregate._sum.total ?? 0,
    };
  }

  async findInvoiceByNumber(number: string) {
    return prisma.invoice.findFirst({
      where: { number, deletedAt: null },
      select: {
        number: true,
        total: true,
        deposit: true,
        paymentStatus: true,
        isDelivered: true,
        createdAt: true,
        client: {
          select: { firstName: true, lastName: true },
        },
        createdBy: {
          select: { firstName: true, lastName: true },
        },
      },
    });
  }

  async getUsersByRole(role: string) {
    return prisma.user.findMany({
      where: { role, isActive: true, deletedAt: null },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });
  }
}
