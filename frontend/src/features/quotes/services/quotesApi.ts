// frontend/src/features/quotes/services/quotesApi.ts
import { api } from "@/lib/axios";
import { unwrap } from "@/lib/apiUtils";
import type { ApiResponse } from "@/shared/types/";
import type {
  QuoteDetail,
  QuotesQueryParams,
  PaginatedQuotesResponse,
  UpdateQuoteRequest,
} from "../types/quotes.types";

export const quotesApi = {
  // ============================================================
  // LISTE PAGINÉE DES DEVIS
  // ============================================================
  getQuotes: (params?: QuotesQueryParams) =>
    api
      .get<ApiResponse<PaginatedQuotesResponse>>("/quotes", { params })
      .then(unwrap),

  // ============================================================
  // DÉTAIL D'UN DEVIS (avec commandes)
  // ============================================================
  getQuoteById: (id: number) =>
    api.get<ApiResponse<QuoteDetail>>(`/quotes/${id}`).then(unwrap),

  // ============================================================
  // MISE À JOUR PARTIELLE D'UN DEVIS
  // ============================================================
  updateQuote: (id: number, data: UpdateQuoteRequest) =>
    api.patch<ApiResponse<QuoteDetail>>(`/quotes/${id}`, data).then(unwrap),

  // ============================================================
  // CONVERTIR UN DEVIS EN FACTURE
  // ============================================================
  convertToInvoice: (id: number) =>
    api
      .post<
        ApiResponse<{
          invoice: { id: number; number: string; total: number };
          quoteId: number;
        }>
      >(`/quotes/${id}/convert`)
      .then(unwrap),

  // ============================================================
  // SOFT DELETE D'UN DEVIS
  // ============================================================
  deleteQuote: (id: number) =>
    api
      .delete<
        ApiResponse<{ success: boolean; message: string }>
      >(`/quotes/${id}`)
      .then(unwrap),

  // ============================================================
  // RESTAURER UN DEVIS (soft delete)
  // ============================================================
  restoreQuote: (id: number) =>
    api.patch<ApiResponse<QuoteDetail>>(`/quotes/${id}/restore`).then(unwrap),
};
