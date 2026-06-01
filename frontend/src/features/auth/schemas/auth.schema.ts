import { z } from "zod";
import {
  emailSchema,
  passwordSchema,
  firstNameSchema,
  lastNameSchema,
  phoneSchema,
  imageUrlSchema,
  UserRole,
} from "@/shared/schemas";

// ============================================
// Invitation d’un utilisateur (admin)
// ============================================
export const inviteUserSchema = z.object({
  email: emailSchema,
  role: UserRole.default("SALES"),
});
// ============================================
// Login
// ============================================
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Le mot de passe est requis"),
});
export type LoginRequest = z.infer<typeof loginSchema>;

// ============================================
// Register (finalisation d’invitation)
// ============================================
export const registerSchema = z
  .object({
    token: z.string().min(1, "Le token est requis"),
    avatarUrl: imageUrlSchema,
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    phone: phoneSchema,
    address: z.string().trim().optional(),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });
export type RegisterRequest = z.infer<typeof registerSchema>;
// ============================================
// Changement de mot de passe (connecté)
// ============================================
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
    newPassword: passwordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmNewPassword"],
  });

// ============================================
// Mot de passe oublié
// ============================================
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// ============================================
// Réinitialisation du mot de passe
// ============================================
export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Le token est requis"),
  newPassword: passwordSchema,
});

// ============================================
// Confirmation de changement d’email
// ============================================
export const confirmEmailChangeSchema = z.object({
  token: z.string().min(1, "Le token est requis"),
});
