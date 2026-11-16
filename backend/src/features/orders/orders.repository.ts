import { prisma } from "@/config/prisma.js";
import { Prisma } from "@/generated/prisma/client.js";
import {
  orderListSelect,
  orderDetailSelect,
  OrdersQuery,
  UpdateOrderInput,
  AddOrderNoteInput,
  AddOrderFileInput,
  UpdateOrderStatusInput,
  PaginatedOrdersList,
  OrderStats,
} from "./orders.types.js";
import {
  IN_PROGRESS_STATUSES,
  IN_PRODUCTION_STATUSES,
} from "./orders.constants.js";
import { notificationsService } from "@/features/notifications/index.js";
import { NOTIFICATION_TYPES } from "@/features/notifications/index.js";
import { ORDER_STATUS_PIPELINE } from "./orders.constants.js";
import { BadRequestError } from "@/shared/error/error.js";

export class OrdersRepository {
  async findAll(query: OrdersQuery): Promise<PaginatedOrdersList> {
    const {
      page,
      limit,
      search,
      status,
      clientId,
      sortBy,
      sortOrder,
      startDate,
      endDate,
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = { deletedAt: null };

    if (status) where.status = status;
    if (clientId) where.clientId = clientId;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    if (search) {
      where.OR = [
        { reference: { contains: search, mode: "insensitive" } },
        { designation: { contains: search, mode: "insensitive" } },
        { label: { contains: search, mode: "insensitive" } },
        { dimensions: { contains: search, mode: "insensitive" } },
        { client: { firstName: { contains: search, mode: "insensitive" } } },
        { client: { lastName: { contains: search, mode: "insensitive" } } },
        {
          invoice: {
            number: { contains: search, mode: "insensitive" },
          },
        },
        {
          quote: {
            number: { contains: search, mode: "insensitive" },
          },
        },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where,
        select: orderListSelect,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.order.count({ where }),
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
        sortBy,
        sortOrder,
      },
    };
  }

  async findById(id: number) {
    return await prisma.order.findUnique({
      where: { id, deletedAt: null },
      select: orderDetailSelect,
    });
  }

  async update(id: number, data: UpdateOrderInput) {
    return await prisma.order.update({
      where: { id, deletedAt: null },
      data,
      select: orderDetailSelect,
    });
  }

  async updateStatus(id: number, status: UpdateOrderStatusInput["status"]) {
    return await prisma.order.update({
      where: { id, deletedAt: null },
      data: { status },
      select: orderDetailSelect,
    });
  }

  async updateStatusWithHistory(
    tx: Prisma.TransactionClient,
    id: number,
    status: UpdateOrderStatusInput["status"],
    historyData: {
      fromStatus: string;
      changedById: string;
    },
  ) {
    if (status === "not_applicable") {
      throw new BadRequestError(
        "Ce statut ne peut pas être appliqué manuellement",
      );
    }
    const updated = await tx.order.update({
      where: { id, deletedAt: null },
      data: { status },
      select: orderDetailSelect,
    });

    await tx.orderStatusHistory.create({
      data: {
        orderId: id,
        fromStatus: historyData.fromStatus,
        toStatus: status,
        changedById: historyData.changedById,
      },
    });
    const getStatusIndex = (status: string | null): number => {
      if (!status) return -1;
      return ORDER_STATUS_PIPELINE[status] ?? -1;
    };

    const fromIndex = getStatusIndex(historyData.fromStatus);
    const toIndex = getStatusIndex(status);

    const isRollback = toIndex < fromIndex && fromIndex >= 0 && toIndex >= 0;

    if (isRollback) {
      await notificationsService.notifyRoles(
        tx,
        ["GRAPHIC_DESIGNER", "PRINTER", "SALES", "ADMIN"],
        {
          type: NOTIFICATION_TYPES.ORDER_STATUS_ROLLBACK,
          title: "Retour arrière de statut",
          message: `Commande ${updated.reference} : retour de "${historyData.fromStatus}" vers "${status}"`,
          link: `/orders?openOrder=${id}`,
          orderId: id,
          metadata: {
            fromStatus: historyData.fromStatus,
            toStatus: status,
          },
        },
      );
    } else if (status === "file_completed") {
      await notificationsService.notifyRoles(tx, ["PRINTER"], {
        type: NOTIFICATION_TYPES.ORDER_FILE_COMPLETED,
        title: "Fichier prêt à imprimer",
        message: `Commande ${updated.reference} : fichier prêt`,
        link: `/orders?openOrder=${id}`,
        orderId: id,
        metadata: {
          fromStatus: historyData.fromStatus,
          toStatus: status,
        },
      });
    } else if (status === "ready_for_delivery") {
      await notificationsService.notifyRoles(tx, ["SALES"], {
        type: NOTIFICATION_TYPES.ORDER_READY_FOR_DELIVERY,
        title: "Commande prête pour livraison",
        message: `Commande ${updated.reference} : prête pour livraison`,
        link: `/orders?openOrder=${id}`,
        orderId: id,
        metadata: {
          fromStatus: historyData.fromStatus,
          toStatus: status,
        },
      });
    }

    return updated;
  }

  async addNote(orderId: number, userId: string, data: AddOrderNoteInput) {
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
          select: { id: true, firstName: true, lastName: true },
        },
        createdAt: true,
      },
    });
  }

  async addFile(orderId: number, userId: string, data: AddOrderFileInput) {
    return await prisma.file.create({
      data: {
        url: data.url,
        category: data.category,
        orderId,
        uploadedById: userId,
      },
      select: {
        id: true,
        url: true,
        category: true,
        uploadedById: true,
        uploadedBy: {
          select: { id: true, firstName: true, lastName: true },
        },
        createdAt: true,
      },
    });
  }

  async deleteFile(fileId: number, userId: string) {
    return await prisma.file.delete({
      where: { id: fileId },
    });
  }

  async deleteNote(noteId: number) {
    return await prisma.note.delete({
      where: { id: noteId },
    });
  }

  async getStats(): Promise<OrderStats> {
    const baseWhere: Prisma.OrderWhereInput = {
      deletedAt: null,
      status: { not: "not_applicable" },
    };

    const [
      waitingForFile,
      inProgress,
      inProduction,
      readyForDelivery,
      grouped,
    ] = await Promise.all([
      prisma.order.count({
        where: { ...baseWhere, status: "waiting_for_file" },
      }),
      prisma.order.count({
        where: {
          ...baseWhere,
          status: { in: [...IN_PROGRESS_STATUSES] },
        },
      }),
      prisma.order.count({
        where: {
          ...baseWhere,
          status: { in: [...IN_PRODUCTION_STATUSES] },
        },
      }),
      prisma.order.count({
        where: { ...baseWhere, status: "ready_for_delivery" },
      }),
      prisma.order.groupBy({
        by: ["status"],
        where: baseWhere,
        _count: { _all: true },
      }),
    ]);

    const byStatus: Record<string, number> = {};
    for (const row of grouped) {
      byStatus[row.status] = row._count._all;
    }

    return {
      waitingForFile,
      inProgress,
      inProduction,
      readyForDelivery,
      byStatus,
    };
  }
}
