import { z } from "zod";
import { paginationSchema } from "@/shared/schemas/query.schema.js";

export const orderStatusHistoryQuerySchema = paginationSchema.extend({
  orderId: z.coerce.number().int().positive().optional(),
  changedById: z.uuid().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const orderStatusHistoryIdParamSchema = z.object({
  id: z.coerce.number().int().positive("L'ID de l'entrée est invalide"),
});

export const orderIdParamSchema = z.object({
  orderId: z.coerce.number().int().positive("L'ID de la commande est invalide"),
});