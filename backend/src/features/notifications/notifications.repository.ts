import { prisma } from "@/config/prisma.js";
import { Prisma } from "@/generated/prisma/client.js";
import {
  notificationSelect,
  CreateNotificationInput,
  NotificationsQuery,
  PaginatedNotificationsList,
} from "./notifications.types.js";

export class NotificationsRepository {
  // ============================================================
  // CRÉER UNE NOTIFICATION (transactionnel)
  // ============================================================
  async create(
    tx: Prisma.TransactionClient,
    data: CreateNotificationInput,
  ) {
    return await tx.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        link: data.link ?? null,
        orderId: data.orderId ?? null,
        metadata: data.metadata ?? undefined,
      },
      select: notificationSelect,
    });
  }

  // ============================================================
  // CRÉER PLUSIEURS NOTIFICATIONS (une par destinataire)
  // ============================================================
  async createMany(
    tx: Prisma.TransactionClient,
    items: CreateNotificationInput[],
  ) {
    return await tx.notification.createMany({
      data: items.map((item) => ({
        userId: item.userId,
        type: item.type,
        title: item.title,
        message: item.message,
        link: item.link ?? null,
        orderId: item.orderId ?? null,
        metadata: item.metadata ?? undefined,
      })),
    });
  }

  // ============================================================
  // LISTER LES NOTIFICATIONS D'UN UTILISATEUR (pagination, filtre)
  // ============================================================
  async findAllByUser(
    userId: string,
    query: NotificationsQuery,
  ): Promise<PaginatedNotificationsList> {
    const { page, limit, unreadOnly } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.NotificationWhereInput = { userId };
    if (unreadOnly) where.readAt = null;

    const [data, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        select: notificationSelect,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.notification.count({ where }),
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
  // COMPTER LES NON-LUES
  // ============================================================
  async countUnread(userId: string): Promise<number> {
    return await prisma.notification.count({
      where: { userId, readAt: null },
    });
  }

  // ============================================================
  // MARQUER UNE NOTIFICATION COMME LUE
  // ============================================================
  async markAsRead(id: number, userId: string) {
    return await prisma.notification.updateMany({
      where: { id, userId, readAt: null },
      data: { readAt: new Date() },
    });
  }

  // ============================================================
  // MARQUER TOUTES LES NOTIFICATIONS COMME LUES
  // ============================================================
  async markAllAsRead(userId: string) {
    return await prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
  }

  // ============================================================
  // SUPPRIMER UNE NOTIFICATION
  // ============================================================
  async delete(id: number, userId: string) {
    return await prisma.notification.deleteMany({
      where: { id, userId },
    });
  }
}