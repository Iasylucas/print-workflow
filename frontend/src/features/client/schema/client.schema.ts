import { z } from "zod";
import { firstNameSchema } from "@/shared/schemas";

// Création d'un client (tous les champs)
export const createClientSchema = z.object({
  firstName: firstNameSchema, // ✅ requis (grace à firstNameSchema)
  lastName: z.string().trim().optional().nullable(),
  email: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.email("Email invalide").optional().nullable(),
  ),
  phone: z.string().trim().optional().nullable(),
  address: z.string().trim().optional().nullable(),
});

// Mise à jour (tous optionnels)
export const updateClientSchema = createClientSchema.partial();

// Requête (pagination, recherche, tri)
export const clientQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "lastName", "firstName"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
