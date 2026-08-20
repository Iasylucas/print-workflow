import { prisma } from "@/config/prisma.js";
import { Prisma } from "@/generated/prisma/client.js";
import { userSafeSelect } from "@/shared/types/user.types.js";
import {
  CreateEmailChangeRequestInput,
  InvitationData,
  InvitationQuery,
  PaginatedInvitationList,
  PaginatedUserList,
  UpdateUserInput,
  UserQuery,
} from "./user.types.js";
import { findUserByEmail } from "@/utils/index.js";

export class UserRepository {
  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id, deletedAt: null },
      select: userSafeSelect,
    });
  }

  async findByEmail(email: string) {
    return await findUserByEmail(email, userSafeSelect);
  }

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

  async update(id: string, data: UpdateUserInput) {
    return await prisma.user.update({
      where: { id, deletedAt: null },
      data,
      select: userSafeSelect,
    });
  }

  async softDelete(id: string) {
    return await prisma.user.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
      select: userSafeSelect,
    });
  }

  async hardDelete(id: string) {
    return await prisma.user.delete({
      where: { id, deletedAt: null },
      select: userSafeSelect,
    });
  }

  async deleteOldEmailChangeRequests(userId: string) {
    await prisma.emailChangeRequest.deleteMany({
      where: {
        userId,
        usedAt: null,
      },
    });
  }

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

  async findEmailChangeRequestByTokenHash(tokenHash: string) {
    return await prisma.emailChangeRequest.findUnique({
      where: { tokenHash },
      include: { user: { select: userSafeSelect } },
    });
  }

  async markEmailChangeRequestAsUsed(id: string) {
    await prisma.emailChangeRequest.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }

  async updateUserEmail(userId: string, newEmail: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { email: newEmail },
    });
  }

  async findAllInvitationsPaginated(
    query: InvitationQuery,
  ): Promise<PaginatedInvitationList> {
    const { page, limit, sortBy, sortOrder, search, role } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.InvitationTokenWhereInput = { usedAt: null };

    if (search) {
      where.email = { contains: search, mode: "insensitive" };
    }

    if (role) {
      where.role = role;
    }

    const [rawInvitations, total] = await Promise.all([
      prisma.invitationToken.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.invitationToken.count({ where }),
    ]);

    const now = new Date();

    const data: InvitationData[] = rawInvitations.map((inv) => ({
      ...inv,
      isExpired: inv.expiresAt < now,
    }));

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

  async findInvitationById(id: string) {
    return await prisma.invitationToken.findFirst({
      where: { id, usedAt: null },
    });
  }

  async deleteInvitation(id: string): Promise<void> {
    await prisma.invitationToken.delete({
      where: { id },
    });
  }
}
