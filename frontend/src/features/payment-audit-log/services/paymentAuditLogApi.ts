import { api } from "@/lib/axios";
import { unwrap } from "@/lib/apiUtils";
import type { ApiResponse } from "@/shared/types";
import type {
  PaginatedPaymentAuditLogsResponse,
  PaymentAuditLog,
  PaymentAuditLogQueryParams,
  PaymentAuditLogStats,
  PaymentAuditLogStatsParams,
} from "../types/payment-audit-log.types";

export const paymentAuditLogApi = {
  // ============================================================
  // LISTER L'HISTORIQUE (pagination, filtres)
  // ============================================================
  getLogs: (params?: PaymentAuditLogQueryParams) =>
    api
      .get<
        ApiResponse<PaginatedPaymentAuditLogsResponse>
      >("/payment-audit-logs", { params })
      .then(unwrap),

  // ============================================================
  // DÉTAIL D'UNE ENTRÉE
  // ============================================================
  getLogById: (id: string) =>
    api
      .get<ApiResponse<PaymentAuditLog>>(`/payment-audit-logs/${id}`)
      .then(unwrap),

  // ============================================================
  // HISTORIQUE D'UN PAIEMENT SPÉCIFIQUE
  // ============================================================
  getLogsByPaymentId: (paymentId: number) =>
    api
      .get<
        ApiResponse<PaymentAuditLog[]>
      >(`/payment-audit-logs/payment/${paymentId}`)
      .then(unwrap),

  // ============================================================
  // STATISTIQUES D'AUDIT
  // ============================================================
  getStats: (params?: PaymentAuditLogStatsParams) =>
    api
      .get<
        ApiResponse<PaymentAuditLogStats>
      >("/payment-audit-logs/stats", { params })
      .then(unwrap),
};
