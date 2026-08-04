// frontend/src/features/quotes/hooks/useQuotes.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { quotesApi } from "../services/quotesApi";
import type {
  QuotesQueryParams,
  UpdateQuoteRequest,
} from "../types/quotes.types";
import { toast } from "sonner";

const QUOTES_QUERY_KEY = "quotes";

// ============================================================
// 1. HOOK POUR LA LISTE PAGINÉE
// ============================================================
export const useQuotes = (params: QuotesQueryParams) => {
  return useQuery({
    queryKey: [QUOTES_QUERY_KEY, params],
    queryFn: () => quotesApi.getQuotes(params),
    staleTime: 1000 * 60 * 2,
  });
};

// ============================================================
// 2. HOOK POUR LE DÉTAIL D'UN DEVIS
// ============================================================
export const useQuoteDetail = (id: number | null) => {
  return useQuery({
    queryKey: [QUOTES_QUERY_KEY, "detail", id],
    queryFn: () => quotesApi.getQuoteById(id!),
    enabled: !!id,
    staleTime: 0,
  });
};

// ============================================================
// 3. HOOK POUR LES MUTATIONS
// ============================================================
export const useQuoteMutations = () => {
  const queryClient = useQueryClient();

  const invalidateQuotes = () => {
    queryClient.invalidateQueries({ queryKey: [QUOTES_QUERY_KEY] });
  };

  // Mise à jour partielle
  const updateQuoteMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateQuoteRequest }) =>
      quotesApi.updateQuote(id, data),
    onSuccess: (_, { id }) => {
      toast.success("Devis mis à jour avec succès");
      invalidateQuotes();
      queryClient.invalidateQueries({
        queryKey: [QUOTES_QUERY_KEY, "detail", id],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de la mise à jour du devis");
    },
  });

  // Convertir en facture
  const convertToInvoiceMutation = useMutation({
    mutationFn: (id: number) => quotesApi.convertToInvoice(id),
    onSuccess: (data, id) => {
      toast.success("Devis converti en facture avec succès");
      invalidateQuotes();
      queryClient.invalidateQueries({
        queryKey: [QUOTES_QUERY_KEY, "detail", id],
      });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de la conversion du devis");
    },
  });

  // Suppression d'un devis (soft delete)
  const deleteQuoteMutation = useMutation({
    mutationFn: (id: number) => quotesApi.deleteQuote(id),
    onSuccess: () => {
      toast.success("Devis supprimé avec succès");
      invalidateQuotes();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de la suppression du devis");
    },
  });

  // Restaurer un devis
  const restoreQuoteMutation = useMutation({
    mutationFn: (id: number) => quotesApi.restoreQuote(id),
    onSuccess: (_, id) => {
      toast.success("Devis restauré avec succès");
      invalidateQuotes();
      queryClient.invalidateQueries({
        queryKey: [QUOTES_QUERY_KEY, "detail", id],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de la restauration du devis");
    },
  });

  return {
    updateQuoteMutation,
    convertToInvoiceMutation,
    deleteQuoteMutation,
    restoreQuoteMutation,
  };
};
