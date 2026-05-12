import { Prisma } from "@/generated/prisma/client.js";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { z } from "zod";

export const userSafeSelect = {
  id: true,
  firstname: true,
  lastname: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export const userCompleteSelect = {
  ...userSafeSelect,
  deletedAt: true,
  password: true,
} satisfies Prisma.UserSelect;

export type UserSafe = Prisma.UserGetPayload<{ select: typeof userSafeSelect }>;

export type UserComplete = Prisma.UserGetPayload<{
  select: typeof userCompleteSelect;
}>;

export type JWTpayload = {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
};

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
export interface ApiErrorResponse {
  success: boolean;
  message: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;

export interface AuthResponse {
  token: string;
  user: UserSafe;
}
