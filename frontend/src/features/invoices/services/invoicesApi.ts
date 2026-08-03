// frontend/src/features/invoices/services/invoicesApi.ts
import { api } from "@/lib/axios";
import { unwrap } from "@/lib/apiUtils";
import type { ApiResponse } from "@/shared/types/";
import type {
  // Invoice,
  InvoiceDetail,
  InvoicesQueryParams,
  PaginatedInvoicesResponse,
  UpdateInvoiceRequest,
  AddPaymentRequest,
  MarkInvoiceDeliveredRequest,
} from "../types/invoices.types";

export const invoicesApi = {
  // ============================================================
  // LISTE PAGINÉE DES FACTURES
  // ============================================================
  getInvoices: (params?: InvoicesQueryParams) =>
    api
      .get<ApiResponse<PaginatedInvoicesResponse>>("/invoices", { params })
      .then(unwrap),

  // ============================================================
  // DÉTAIL D'UNE FACTURE (avec commandes + paiements)
  // ============================================================
  getInvoiceById: (id: number) =>
    api.get<ApiResponse<InvoiceDetail>>(`/invoices/${id}`).then(unwrap),

  // ============================================================
  // MISE À JOUR PARTIELLE
  // ============================================================
  updateInvoice: (id: number, data: UpdateInvoiceRequest) =>
    api.patch<ApiResponse<InvoiceDetail>>(`/invoices/${id}`, data).then(unwrap),

  // ============================================================
  // MARQUER COMME LIVRÉE (propagation aux commandes)
  // ============================================================
  markAsDelivered: (id: number, data: MarkInvoiceDeliveredRequest) =>
    api
      .patch<ApiResponse<InvoiceDetail>>(`/invoices/${id}/deliver`, data)
      .then(unwrap),

  // ============================================================
  // AJOUT D'UN PAIEMENT
  // ============================================================
  addPayment: (id: number, data: AddPaymentRequest) =>
    api
      .post<
        ApiResponse<{
          id: number;
          amount: number;
          method: string;
          date: string;
        }>
      >(`/invoices/${id}/payments`, data)
      .then(unwrap),

  // ============================================================
  // SUPPRESSION D'UN PAIEMENT
  // ============================================================
  deletePayment: (paymentId: number) =>
    api
      .delete<
        ApiResponse<{ success: boolean; message: string }>
      >(`/invoices/payments/${paymentId}`)
      .then(unwrap),

  // ============================================================
  // SOFT DELETE D'UNE FACTURE
  // ============================================================
  deleteInvoice: (id: number) =>
    api
      .delete<
        ApiResponse<{ success: boolean; message: string }>
      >(`/invoices/${id}`)
      .then(unwrap),

  // ============================================================
  // RESTAURER UNE FACTURE (soft delete)
  // ============================================================
  restoreInvoice: (id: number) =>
    api
      .patch<ApiResponse<InvoiceDetail>>(`/invoices/${id}/restore`)
      .then(unwrap),
};
