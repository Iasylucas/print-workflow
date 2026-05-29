import { Prisma } from "@/generated/prisma/client.js";
import { z } from "zod";
import {
  updateUserSchema,
  updateProfileSchema,
  userQuerySchema,
} from "./user.schema.js";
import { userSafeSelect, PaginatedResult } from "@/shared/types/index.js";

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
