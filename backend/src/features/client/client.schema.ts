import { z } from "zod";
import { v7 as uuidv7 } from "uuid";
import {
  firstNameSchema,
  lastNameSchema,
  emailOptionalSchema,
  phoneOptionalSchema,
  paginationSchema,
} from "@/shared/schemas/index.js";

// 3. Schéma de création d'un client
export const createClientSchema = z.object({
  id: z.uuid().default(() => uuidv7()),
  firstName: firstNameSchema,
  lastName: lastNameSchema,
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
export const clientQuerySchema = paginationSchema.extend({
  email: emailOptionalSchema,
  id: z.uuid().optional(),
  search: z.string().trim().min(1).optional(),
  sortBy: z.enum(["createdAt", "lastName", "firstName"]).default("createdAt"),
});
