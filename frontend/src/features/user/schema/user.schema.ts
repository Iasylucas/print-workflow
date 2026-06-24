import { UserRole } from "@/shared/schemas";
import { z } from "zod";

export const editUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "Prénom trop court")
    .max(50)
    .optional()
    .nullable(),
  lastName: z
    .string()
    .trim()
    .min(2, "Nom trop court")
    .max(50)
    .optional()
    .nullable(),
  role: z.enum(["ADMIN", "SALES", "PRINTER", "GRAPHIC_DESIGNER"]).optional(),
  isActive: z.boolean().optional(),
  avatarUrl: z.string().optional(),
});

export const inviteUserSchema = z.object({
  email: z.email("Email invalide"),
  role: UserRole,
});
