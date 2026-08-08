// frontend/src/features/auth/types/auth.types.ts
import { z } from "zod";
import {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  confirmEmailChangeSchema,
  inviteUserSchema,
} from "../schemas/auth.schema";

// ============================================
// Types inférés depuis les schémas Zod
// ============================================
export type LoginRequest = z.infer<typeof loginSchema>;
export type FinalizeRegistrationRequest = z.infer<typeof registerSchema>;
export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;
export type ConfirmEmailChangeRequest = z.infer<
  typeof confirmEmailChangeSchema
>;
export type InviteUserRequest = z.infer<typeof inviteUserSchema>;

export type ResetPasswordApiRequest = {
  token: string;
  newPassword: string;
};

// ============================================
// Types de réponse (non inférés – définis manuellement)
// ============================================
export type User = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  role: "ADMIN" | "SALES" | "PRINTER" | "GRAPHIC_DESIGNER";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
};

export type FinalizeRegistrationResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
};

export type ApiError = {
  success: false;
  error: string;
  details?: Array<{ field: string; message: string }>;
};
