import { prisma } from "@/config/prisma.js";
import { Prisma } from "@/generated/prisma/client.js";
import {
  clientSelect,
  CreateClientInput,
  UpdateClientInput,
  ClientQuery,
  PaginatedClientList,
} from "./client.types.js";

export class ClientRepository {
  async create(data: CreateClientInput) {
    return await prisma.client.create({ data, select: clientSelect });
  }

  async findByEmail(email: string) {
    return await prisma.client.findUnique({
      where: { email, deletedAt: null },
      select: clientSelect,
    });
  }

  async findById(id: string) {
    return await prisma.client.findUnique({
      where: { id, deletedAt: null },
      select: clientSelect,
    });
  }

  async findAll(query: ClientQuery): Promise<PaginatedClientList> {
    const { page, limit, search, sortBy, sortOrder, email, id } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ClientWhereInput = { deletedAt: null };

    if (email) where.email = email;
    if (id) where.id = id;

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        select: clientSelect,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.client.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return {
      data: clients,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasMore,
        search: search || undefined,
        sortBy,
        sortOrder,
      },
    };
  }

  async update(id: string, data: UpdateClientInput) {
    return await prisma.client.update({
      where: { id, deletedAt: null },
      data,
      select: clientSelect,
    });
  }

  async delete(id: string) {
    return await prisma.client.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
