// backend/src/features/orders/orders.repository.ts
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
} from "./orders.types.js";

export class OrdersRepository {
  // ============================================
  // LISTE PAGINÉE DES COMMANDES
  // ============================================
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

  // ============================================
  // DÉTAIL D'UNE COMMANDE
  // ============================================
  async findById(id: number) {
    return await prisma.order.findUnique({
      where: { id, deletedAt: null },
      select: orderDetailSelect,
    });
  }

  // ============================================
  // MISE À JOUR PARTIELLE D'UNE COMMANDE
  // ============================================
  async update(id: number, data: UpdateOrderInput) {
    return await prisma.order.update({
      where: { id, deletedAt: null },
      data,
      select: orderDetailSelect,
    });
  }

  // ============================================
  // MISE À JOUR DU STATUT
  // ============================================
  async updateStatus(id: number, status: UpdateOrderStatusInput["status"]) {
    return await prisma.order.update({
      where: { id, deletedAt: null },
      data: { status },
      select: orderDetailSelect,
    });
  }

  // ============================================
  // AJOUT D'UNE NOTE
  // ============================================
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

  // ============================================
  // AJOUT D'UN FICHIER (VISUEL)
  // ============================================
  async addFile(orderId: number, userId: string, data: AddOrderFileInput) {
    console.log("Creating file with:", {
      url: data.url,
      category: data.category,
      orderId,
      uploadedById: userId,
    });
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

  // ============================================
  // SUPPRESSION D'UN FICHIER (optionnel)
  // ============================================
  async deleteFile(fileId: number, userId: string) {
    // Vérifier que le fichier appartient bien à l'utilisateur ou qu'il est admin
    // (à gérer dans le service)
    return await prisma.file.delete({
      where: { id: fileId },
    });
  }

  // ============================================
  // SUPPRESSION D'UNE NOTE (optionnel)
  // ============================================
  async deleteNote(noteId: number) {
    return await prisma.note.delete({
      where: { id: noteId },
    });
  }
}
