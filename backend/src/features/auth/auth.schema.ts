import { z } from "zod";
import { v7 as uuidv7 } from "uuid";
import { emailRequiredSchema, passwordSchema } from "@/shared/schemas/index.js";
import { imageUrlSchema } from "@/shared/schemas/image.schema.js";

// 1. Roles autorisés dans ton système
const UserRole = z.enum(["ADMIN", "SALES", "PRINTER", "GRAPHIC_DESIGNER"]);

// input for the invitation action (by the admin)
export const inviteUserSchema = z.object({
  id: z.uuid().default(() => uuidv7()),
  email: emailRequiredSchema,
  role: UserRole.default("SALES"),
});

// input for the finalization action (by the colaborator)
export const finalizeRegistrationSchema = z
  .object({
    token: z.string().min(1, "Invitation token is required"),
    avatarUrl: imageUrlSchema,
    firstName: z
      .string()
      .trim()
      .min(2, "Firstname must be at least 2 characters long"),
    lastName: z
      .string()
      .trim()
      .min(2, "Lastname must be at least 2 characters long"),
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
  token: z.string().min(1, "Token is required"),
  newPassword: passwordSchema,
});
