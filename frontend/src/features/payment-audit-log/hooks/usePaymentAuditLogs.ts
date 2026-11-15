import { useQuery } from "@tanstack/react-query";
import { paymentAuditLogApi } from "../services/paymentAuditLogApi";
import type {
  PaymentAuditLogQueryParams,
  PaymentAuditLogStatsParams,
} from "../types/payment-audit-log.types";

const PAYMENT_AUDIT_LOG_QUERY_KEY = "payment-audit-logs";

// ============================================================
// HOOK POUR LA LISTE PAGINÉE
// ============================================================
export const usePaymentAuditLogs = (params: PaymentAuditLogQueryParams) => {
  return useQuery({
    queryKey: [PAYMENT_AUDIT_LOG_QUERY_KEY, params],
    queryFn: () => paymentAuditLogApi.getLogs(params),
    staleTime: 1000 * 60 * 2,
  });
};

// ============================================================
// HOOK POUR LE DÉTAIL D'UNE ENTRÉE
// ============================================================
export const usePaymentAuditLogDetail = (id: string | null) => {
  return useQuery({
    queryKey: [PAYMENT_AUDIT_LOG_QUERY_KEY, "detail", id],
    queryFn: () => paymentAuditLogApi.getLogById(id!),
    enabled: !!id,
    staleTime: 0,
  });
};

// ============================================================
// HOOK POUR L'HISTORIQUE D'UN PAIEMENT
// ============================================================
export const usePaymentAuditLogsByPaymentId = (paymentId: number | null) => {
  return useQuery({
    queryKey: [PAYMENT_AUDIT_LOG_QUERY_KEY, "payment", paymentId],
    queryFn: () => paymentAuditLogApi.getLogsByPaymentId(paymentId!),
    enabled: !!paymentId,
    staleTime: 1000 * 60 * 2,
  });
};

// ============================================================
// HOOK POUR LES STATISTIQUES D'AUDIT
// ============================================================
export const usePaymentAuditLogStats = (params: PaymentAuditLogStatsParams) => {
  return useQuery({
    queryKey: [PAYMENT_AUDIT_LOG_QUERY_KEY, "stats", params],
    queryFn: () => paymentAuditLogApi.getStats(params),
    staleTime: 1000 * 60 * 2,
  });
};
