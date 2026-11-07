import { prisma } from "@/config/prisma.js";
import { Prisma } from "@/generated/prisma/client.js";
import {
  paymentAuditLogSelect,
  PaymentAuditLogStats,
  CreatePaymentAuditLogInput,
  PaymentAuditLogQuery,
  PaginatedPaymentAuditLogList,
} from "./payment-audit-log.types.js";

export class PaymentAuditLogRepository {
  // ============================================================
  // CRÉER UNE ENTRÉE D'AUDIT (transactionnel)
  // ============================================================
  async create(tx: Prisma.TransactionClient, data: CreatePaymentAuditLogInput) {
    return await tx.paymentAuditLog.create({
      data: {
        action: data.action,
        paymentId: data.paymentId ?? null,
        userId: data.userId,
        oldData: (data.oldData ?? undefined) as
          | Prisma.InputJsonValue
          | undefined,
        newData: (data.newData ?? undefined) as
          | Prisma.InputJsonValue
          | undefined,
        reason: data.reason ?? null,
      },
      select: paymentAuditLogSelect,
    });
  }

  // ============================================================
  // LISTER L'HISTORIQUE (pagination, filtres)
  // ============================================================
  async findAll(
    query: PaymentAuditLogQuery,
  ): Promise<PaginatedPaymentAuditLogList> {
    const {
      page,
      limit,
      invoiceNumber,
      action,
      userId,
      startDate,
      endDate,
      sortBy,
      sortOrder,
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.PaymentAuditLogWhereInput = {};

    if (invoiceNumber) {
      where.payment = {
        is: {
          invoice: {
            is: {
              number: { contains: invoiceNumber, mode: "insensitive" },
            },
          },
        },
      };
    }
    if (action) where.action = action;
    if (userId) where.userId = userId;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [data, total] = await Promise.all([
      prisma.paymentAuditLog.findMany({
        where,
        select: paymentAuditLogSelect,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.paymentAuditLog.count({ where }),
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
        sortBy,
        sortOrder,
      },
    };
  }

  // ============================================================
  // TROUVER UNE ENTRÉE PAR ID
  // ============================================================
  async findById(id: string) {
    return await prisma.paymentAuditLog.findUnique({
      where: { id },
      select: paymentAuditLogSelect,
    });
  }

  // ============================================================
  // HISTORIQUE D'UN PAIEMENT SPÉCIFIQUE
  // ============================================================
  async getByPaymentId(paymentId: number) {
    return await prisma.paymentAuditLog.findMany({
      where: { paymentId },
      select: paymentAuditLogSelect,
      orderBy: { createdAt: "desc" },
    });
  }

  // ============================================================
  // STATISTIQUES D'AUDIT
  // ============================================================
  async getStats(query: PaymentAuditLogQuery): Promise<PaymentAuditLogStats> {
    const { invoiceNumber, action, userId, startDate, endDate } = query;

    const where: Prisma.PaymentAuditLogWhereInput = {};
    if (invoiceNumber) {
      where.payment = {
        is: {
          invoice: {
            is: {
              number: { contains: invoiceNumber, mode: "insensitive" },
            },
          },
        },
      };
    }
    if (action) where.action = action;
    if (userId) where.userId = userId;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const paymentWhere: Prisma.PaymentWhereInput = { deletedAt: null };

    if (invoiceNumber) {
      paymentWhere.invoice = {
        is: {
          number: { contains: invoiceNumber, mode: "insensitive" },
        },
      };
    }
    if (startDate || endDate) {
      paymentWhere.date = {};
      if (startDate) paymentWhere.date.gte = new Date(startDate);
      if (endDate) paymentWhere.date.lte = new Date(endDate);
    }

    const [totalActions, totalCreations, totalDeletions, revenueAgg] =
      await Promise.all([
        prisma.paymentAuditLog.count({ where }),
        prisma.paymentAuditLog.count({ where: { ...where, action: "CREATE" } }),
        prisma.paymentAuditLog.count({ where: { ...where, action: "DELETE" } }),
        prisma.payment.aggregate({
          where: paymentWhere,
          _sum: { amount: true },
        }),
      ]);

    return {
      totalActions,
      totalCreations,
      totalDeletions,
      revenue: revenueAgg._sum.amount ?? 0,
    };
  }
}
