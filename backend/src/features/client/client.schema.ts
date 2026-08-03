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
  firstName: firstNameSchema, // ✅ requis (grace à firstNameSchema)
  lastName: z.string().trim().optional().nullable(),
  email: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.email("Email invalide").optional().nullable(),
  ),
  phone: z.string().trim().optional().nullable(),
  address: z.string().trim().optional().nullable(),
});

// 4. Schéma de mise à jour (tous les champs optionnels)
export const updateClientSchema = createClientSchema
  .partial()
  .omit({ id: true });

// 5. Schéma pour la recherche et la pagination
export const clientQuerySchema = paginationSchema.extend({
  email: emailOptionalSchema,
  id: z.uuid().optional(),
  search: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "lastName", "firstName"]).default("createdAt"),
});
