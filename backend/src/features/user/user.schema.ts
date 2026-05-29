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

// Schéma pour la mise à jour d’un utilisateur par l’admin (sans email pour l’instant)
export const updateUserSchema = z.object({
  firstName: firstNameSchema.optional(),
  lastName: lastNameSchema.optional(),
  phone: phoneSchema.optional(),
  address: z.string().optional(),
  role: UserRole.optional(),
  isActive: z.boolean().optional(),
  avatarUrl: imageUrlSchema,
});

// Schéma pour la mise à jour du profil par l’utilisateur lui-même
export const updateProfileSchema = z.object({
  firstName: firstNameSchema.optional(),
  lastName: lastNameSchema.optional(),
  phone: phoneSchema.optional(),
  address: z.string().optional(),
  avatarUrl: imageUrlSchema,
});

// Schéma pour la requête d’historique (pagination, recherche, tri)
export const userQuerySchema = paginationSchema.extend({
  sortBy: z
    .enum(["createdAt", "email", "firstName", "lastName", "role"])
    .default("createdAt"),
  search: z.string().trim().optional(),
});

// Admin modifie un utilisateur – avec newEmail
export const updateUserWithEmailSchema = updateUserSchema.extend({
  newEmail: emailRequiredSchema,
});

// Confirmation de changement d’email
export const confirmEmailChangeSchema = z.object({
  token: z.string().min(1, "Token is required"),
});
