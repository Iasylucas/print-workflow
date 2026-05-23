import {
  loginSchema,
  inviteUserSchema,
  finalizeRegistrationSchema,
} from "./auth.schema.js";
import { z } from "zod";
import { UserSafe } from "@/shared/types/index.js";

export type JWTpayload = {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export type InviteUserInput = z.infer<typeof inviteUserSchema>;

export type FinalizeRegistrationInput = z.infer<
  typeof finalizeRegistrationSchema
>;

export type LoginInput = z.infer<typeof loginSchema>;

export type ForgotPasswordInput = {
  email: string;
};

export type ResetPasswordInput = {
  token: string;
  newPassword: string;
};

export type ConfirmEmailChangeInput = {
  token: string;
};

export type inviteData = {
  id: string;
  tokenHash: string;
  email: string;
  role: string;
  expiresAt: Date;
  userId: string;
};

export interface AuthResponse {
  token: string;
  user: UserSafe;
}
