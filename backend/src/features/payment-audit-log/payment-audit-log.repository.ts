import { prisma } from "@/config/prisma.js";
import { Prisma } from "@/generated/prisma/client.js";
import {
  paymentAuditLogSelect,
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
    const { page, limit, paymentId, action, userId, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.PaymentAuditLogWhereInput = {};

    if (paymentId) where.paymentId = paymentId;
    if (action) where.action = action;
    if (userId) where.userId = userId;

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
  async findByPaymentId(paymentId: number) {
    return await prisma.paymentAuditLog.findMany({
      where: { paymentId },
      select: paymentAuditLogSelect,
      orderBy: { createdAt: "desc" },
    });
  }
}
