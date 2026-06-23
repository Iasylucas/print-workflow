import { Prisma } from "@/generated/prisma/client.js";
import { z } from "zod";
import {
  updateUserSchema,
  updateProfileSchema,
  userQuerySchema,
} from "./user.schema.js";
import { userSafeSelect, PaginatedResult } from "@/shared/types/index.js";
import { Role } from "@/generated/prisma/client.js";

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export type UserQuery = z.infer<typeof userQuerySchema>;

export type PaginatedUserList = PaginatedResult<
  Prisma.UserGetPayload<{ select: typeof userSafeSelect }>
>;

export type CreateEmailChangeRequestInput = {
  id: string;
  userId: string;
  newEmail: string;
  tokenHash: string;
  expiresAt: Date;
};

export interface InvitationQuery {
  page: number;
  limit: number;
  sortBy: "createdAt" | "email" | "expiresAt";
  sortOrder: "asc" | "desc";
  search?: string;
  role?: Role;
}

export interface InvitationData {
  id: string;
  token: string;
  email: string;
  role: Role;
  expiresAt: Date;
  createdAt: Date;
  usedAt: Date | null;
  isExpired: boolean;
}

export interface PaginatedInvitationList {
  data: InvitationData[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
    search?: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
  };
}
