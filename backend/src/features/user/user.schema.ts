import { z } from "zod";
import {
  imageUrlSchema,
  paginationSchema,
  firstNameSchema,
  lastNameSchema,
  emailRequiredSchema,
  UserRole,
  phoneSchema,
} from "@/shared/schemas/index.js";
export { uuidSchema } from "@/shared/schemas/id.schema.js";

export const updateUserSchema = z.object({
  firstName: firstNameSchema.optional(),
  lastName: lastNameSchema.optional(),
  phone: phoneSchema.optional(),
  address: z.string().optional().nullable(),
  role: UserRole.optional(),
  isActive: z.boolean().optional(),
  avatarUrl: imageUrlSchema,
});

export const updateProfileSchema = z.object({
  firstName: firstNameSchema.optional(),
  lastName: lastNameSchema.optional(),
  phone: phoneSchema.optional(),
  address: z.string().optional().nullable(),
  avatarUrl: imageUrlSchema,
});

export const userQuerySchema = paginationSchema.extend({
  sortBy: z
    .enum(["createdAt", "email", "firstName", "lastName", "role"])
    .default("createdAt"),
  search: z.string().trim().optional(),
  role: UserRole.optional(),
  isActive: z.preprocess((val) => {
    if (val === "true") return true;
    if (val === "false") return false;
    return undefined;
  }, z.boolean().optional()),
});

export const updateUserWithEmailSchema = updateUserSchema.extend({
  newEmail: emailRequiredSchema,
});

export const confirmEmailChangeSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export const invitationQuerySchema = paginationSchema.extend({
  sortBy: z.enum(["createdAt", "email", "expiresAt"]).default("createdAt"),
  search: z.string().trim().optional(),
  role: UserRole.optional(),
});

export type InvitationQueryInput = z.infer<typeof invitationQuerySchema>;
