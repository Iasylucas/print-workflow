import { z } from "zod";
import type { UserRole } from "@/shared/types";
import type { inviteUserSchema } from "../schema/user.schema";

export type User = {
  avatarUrl: string | undefined;
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UsersQueryParams = {
  page?: number;
  limit: number;
  search?: string;
  role?: UserRole;
  sortBy: "createdAt" | "email" | "firstName" | "lastName" | "role";
  sortOrder: "asc" | "desc";
  isActive?: boolean;
};

export type meta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isActive?: boolean;
};

export type PaginatedUsersResponse = {
  data: User[];
  meta: meta;
};

export type InviteUserRequest = z.infer<typeof inviteUserSchema>;

export type EditUserRequest = {
  avatarUrl?: string | undefined;
  firstName?: string | null;
  lastName?: string | null;
  role?: User["role"];
  isActive?: boolean;
};

export type UpdateProfileRequest = {
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | undefined;
};
