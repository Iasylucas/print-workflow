import { z } from "zod";

// ============================================================
// 1. SCHÉMA POUR LES FILTRES (pagination, tri, filtres)
// ============================================================
export const paymentAuditLogQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  paymentId: z.coerce.number().int().positive().optional(),
  action: z.enum(["CREATE", "UPDATE", "DELETE"]).optional(),
  userId: z.uuid().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortBy: z.enum(["createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type PaymentAuditLogQueryParams = z.infer<
  typeof paymentAuditLogQuerySchema
>;
