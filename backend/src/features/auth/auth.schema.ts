import { z } from "zod";
import { v7 as uuidv7 } from "uuid";
import {
  emailRequiredSchema,
  passwordSchema,
  imageUrlSchema,
  tokenSchema,
  firstNameSchema,
  lastNameSchema,
  UserRole,
  phoneSchema,
} from "@/shared/schemas/index.js";

export const inviteUserSchema = z.object({
  id: z.uuid().default(() => uuidv7()),
  email: emailRequiredSchema,
  role: UserRole.default("SALES"),
});

export const finalizeRegistrationSchema = z
  .object({
    id: z.uuid().default(() => uuidv7()),
    token: tokenSchema,
    avatarUrl: imageUrlSchema,
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    phone: phoneSchema,
    address: z.string().trim().optional(),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: emailRequiredSchema,
  password: z.string().min(1, "Password is required"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailRequiredSchema,
});

export const resetPasswordSchema = z.object({
  token: tokenSchema,
  newPassword: passwordSchema,
});

export const confirmEmailChangeSchema = z.object({
  token: tokenSchema,
});
