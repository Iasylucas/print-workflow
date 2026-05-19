import { z } from "zod";
import { v7 as uuidv7 } from "uuid";
import { emailOptionalSchema } from "@/shared/schemas/email.schema.js";
import { phoneOptionalSchema } from "@/shared/schemas/phone.schema.js";

// 3. Schéma de création d'un client
export const createClientSchema = z.object({
  id: z.uuid().default(() => uuidv7()),
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters long")
    .max(50, "First name too long")
    .nullable()
    .optional(),
  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters long")
    .max(50, "Last name too long"),
  email: emailOptionalSchema,
  phone: phoneOptionalSchema,
  address: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .nullable()
    .optional(),
});

// 4. Schéma de mise à jour (tous les champs optionnels)
export const updateClientSchema = createClientSchema
  .partial()
  .omit({ id: true });

// 5. Schéma pour la recherche et la pagination
export const clientQuerySchema = z.object({
  email: emailOptionalSchema,
  id: z.uuid().optional(),
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["createdAt", "lastName", "firstName"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
