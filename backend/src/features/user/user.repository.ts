import { prisma } from "@/config/prisma.js";
import { Prisma } from "@/generated/prisma/client.js";
import { userSafeSelect } from "@/shared/types/user.types.js";
import {
  CreateEmailChangeRequestInput,
  PaginatedUserList,
  UpdateUserInput,
  UserQuery,
} from "./user.types.js";
import { findUserByEmail } from "@/utils/index.js";

export class UserRepository {
  // Récupérer un utilisateur par son ID
  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id, deletedAt: null },
      select: userSafeSelect,
    });
  }

  // Récupérer un utilisateur par son email
  async findByEmail(email: string) {
    return await findUserByEmail(email, userSafeSelect);
  }

  // Lister les utilisateurs avec pagination, recherche et tri
  async findAllPaginated(query: UserQuery): Promise<PaginatedUserList> {
    const { page, limit, sortBy, sortOrder, search, isActive, role } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = { deletedAt: null };

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role) {
      where.role = role;
    }

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: userSafeSelect,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.user.count({ where }),
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
        sortBy,
        sortOrder,
      },
    };
  }

  // Mettre à jour un utilisateur
  async update(id: string, data: UpdateUserInput) {
    return await prisma.user.update({
      where: { id, deletedAt: null },
      data,
      select: userSafeSelect,
    });
  }

  // Soft delete d’un utilisateur
  async softDelete(id: string) {
    return await prisma.user.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
      select: userSafeSelect,
    });
  }

  // Supprimer les anciennes demandes de changement d’email non utilisées
  async deleteOldEmailChangeRequests(userId: string) {
    await prisma.emailChangeRequest.deleteMany({
      where: {
        userId,
        usedAt: null,
      },
    });
  }

  // Créer une demande de changement d’email
  async createEmailChangeRequest(data: CreateEmailChangeRequestInput) {
    await prisma.emailChangeRequest.create({
      data: {
        id: data.id,
        userId: data.userId,
        newEmail: data.newEmail,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
      },
    });
  }

  // Rechercher une demande par son token hash
  async findEmailChangeRequestByTokenHash(tokenHash: string) {
    return await prisma.emailChangeRequest.findUnique({
      where: { tokenHash },
      include: { user: { select: userSafeSelect } },
    });
  }

  // Marquer une demande comme utilisée
  async markEmailChangeRequestAsUsed(id: string) {
    await prisma.emailChangeRequest.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }

  // Mettre à jour l’email d’un utilisateur
  async updateUserEmail(userId: string, newEmail: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { email: newEmail },
    });
  }
}
