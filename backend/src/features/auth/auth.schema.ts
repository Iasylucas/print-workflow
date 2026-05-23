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
} from "@/shared/schemas/index.js";

// input for the invitation action (by the admin)
export const inviteUserSchema = z.object({
  id: z.uuid().default(() => uuidv7()),
  email: emailRequiredSchema,
  role: UserRole.default("SALES"),
});

// input for the finalization action (by the colaborator)
export const finalizeRegistrationSchema = z
  .object({
    token: tokenSchema,
    avatarUrl: imageUrlSchema,
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// input for the login action (by the users)
export const loginSchema = z.object({
  email: emailRequiredSchema,
  password: z.string().min(1, "Password is required"),
});

// input for the change password action (by the users)
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

// input for the forgot password action (by the users)
export const forgotPasswordSchema = z.object({
  email: emailRequiredSchema,
});

// input for the reset password action (by the users)
export const resetPasswordSchema = z.object({
  token: tokenSchema,
  newPassword: passwordSchema,
});

// input for the confirm email change action (by the users)
export const confirmEmailChangeSchema = z.object({
  token: tokenSchema,
});
