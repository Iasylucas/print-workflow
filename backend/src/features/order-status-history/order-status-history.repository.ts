import { prisma } from "@/config/prisma.js";
import { Prisma } from "@/generated/prisma/client.js";
import {
  orderStatusHistorySelect,
  CreateOrderStatusHistoryInput,
  OrderStatusHistoryQuery,
  PaginatedOrderStatusHistoryList,
} from "./order-status-history.types.js";

export class OrderStatusHistoryRepository {
  // ============================================================
  // CRÉER UNE ENTRÉE D'HISTORIQUE (transactionnel)
  // ============================================================
  async create(
    tx: Prisma.TransactionClient,
    data: CreateOrderStatusHistoryInput,
  ) {
    return await tx.orderStatusHistory.create({
      data: {
        orderId: data.orderId,
        fromStatus: data.fromStatus,
        toStatus: data.toStatus,
        changedById: data.changedById,
        },
      select: orderStatusHistorySelect,
    });
  }

  // ============================================================
  // LISTER L'HISTORIQUE (filtres + pagination)
  // ============================================================
  async findAll(
    query: OrderStatusHistoryQuery,
  ): Promise<PaginatedOrderStatusHistoryList> {
    const { page, limit, orderId, changedById, startDate, endDate } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderStatusHistoryWhereInput = {};

    if (orderId) where.orderId = orderId;
    if (changedById) where.changedById = changedById;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [data, total] = await Promise.all([
      prisma.orderStatusHistory.findMany({
        where,
        select: orderStatusHistorySelect,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.orderStatusHistory.count({ where }),
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
      },
    };
  }

  // ============================================================
  // HISTORIQUE D'UNE COMMANDE SPÉCIFIQUE (sans pagination)
  // ============================================================
  async findByOrderId(orderId: number) {
    return await prisma.orderStatusHistory.findMany({
      where: { orderId },
      select: orderStatusHistorySelect,
      orderBy: { createdAt: "desc" },
    });
  }

  // ============================================================
  // DÉTAIL D'UNE ENTRÉE
  // ============================================================
  async findById(id: number) {
    return await prisma.orderStatusHistory.findUnique({
      where: { id },
      select: orderStatusHistorySelect,
    });
  }
}