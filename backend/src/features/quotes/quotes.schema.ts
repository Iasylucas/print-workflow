import { z } from "zod";
import { paginationSchema } from "@/shared/schemas/query.schema.js";

export const updateQuoteSchema = z.object({
  status: z.enum(["pending", "converted"]).optional(),
});

export const quotesQuerySchema = paginationSchema.extend({
  status: z.enum(["pending", "converted"]).optional(),
  clientId: z.uuid().optional(),
  search: z.string().trim().optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "number", "total", "clientId", "status"])
    .default("createdAt"),
});

export const quoteIdParamSchema = z.object({
  id: z.coerce.number().int().positive("L'ID de la facture est invalide"),
});
