import { z } from "zod";
import { Prisma } from "@/generated/prisma/client.js";
import {
  createPaymentAuditLogSchema,
  paymentAuditLogQuerySchema,
} from "./payment-audit-log.schema.js";

// ============================================================
// 1. TYPES INFÉRÉS (Entrées)
// ============================================================
export type CreatePaymentAuditLogInput = z.infer<
  typeof createPaymentAuditLogSchema
>;
export type PaymentAuditLogQuery = z.infer<typeof paymentAuditLogQuerySchema>;

// ============================================================
// 2. SÉLECTION PRISMA (Sorties)
// ============================================================
export const paymentAuditLogSelect = {
  id: true,
  action: true,
  paymentId: true,
  userId: true,
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  },
  oldData: true,
  newData: true,
  reason: true,
  createdAt: true,
} satisfies Prisma.PaymentAuditLogSelect;

export type PaymentAuditLogOutput = Prisma.PaymentAuditLogGetPayload<{
  select: typeof paymentAuditLogSelect;
}>;

// ============================================================
// 3. STRUCTURE PAGINÉE
// ============================================================
export interface PaymentAuditLogStats {
  totalActions: number;
  totalCreations: number;
  totalDeletions: number;
  revenue: number;
}

export interface PaginatedPaymentAuditLogList {
  data: PaymentAuditLogOutput[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
    sortBy: string;
    sortOrder: "asc" | "desc";
  };
}
