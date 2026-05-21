import {
  loginSchema,
  inviteUserSchema,
  finalizeRegistrationSchema,
} from "./auth.schema.js";
import { z } from "zod";
import { UserSafe } from "@/shared/types/user.types.js";

export type JWTpayload = {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
};

export type InviteUserInput = z.infer<typeof inviteUserSchema>;
export type FinalizeRegistrationInput = z.infer<
  typeof finalizeRegistrationSchema
>;
export type LoginInput = z.infer<typeof loginSchema>;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
}
export interface ApiErrorResponse {
  success: boolean;
  error: string;
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
