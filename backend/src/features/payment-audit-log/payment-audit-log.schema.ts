import { z } from "zod";
import { paginationSchema } from "@/shared/schemas/query.schema.js";

// ============================================================
// 1. SCHÉMA POUR LA CRÉATION D'UNE ENTRÉE D'AUDIT
// ============================================================
export const createPaymentAuditLogSchema = z.object({
  action: z.enum(["CREATE", "UPDATE", "DELETE"], {
    error: "L'action doit être CREATE, UPDATE ou DELETE",
  }),
  paymentId: z.number().int().positive().nullable().optional(),
  userId: z.uuid(),
  oldData: z.record(z.string(), z.unknown()).nullable().optional(),
  newData: z.record(z.string(), z.unknown()).nullable().optional(),
  reason: z.string().trim().optional().nullable(),
});

// ============================================================
// 2. SCHÉMA POUR LA REQUÊTE D'HISTORIQUE (pagination, filtres)
// ============================================================
export const paymentAuditLogQuerySchema = paginationSchema.extend({
  paymentId: z.coerce.number().int().positive().optional(),
  action: z.enum(["CREATE", "UPDATE", "DELETE"]).optional(),
  userId: z.uuid().optional(),
  sortBy: z.enum(["createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
