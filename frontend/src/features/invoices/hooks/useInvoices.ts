// frontend/src/features/invoices/hooks/useInvoices.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { invoicesApi } from "../services/invoicesApi";
import type {
  InvoicesQueryParams,
  UpdateInvoiceRequest,
  AddPaymentRequest,
  MarkInvoiceDeliveredRequest,
} from "../types/invoices.types";
import { toast } from "sonner";

const INVOICES_QUERY_KEY = "invoices";

// ============================================================
// 1. HOOK POUR LA LISTE PAGINÉE
// ============================================================
export const useInvoices = (params: InvoicesQueryParams) => {
  return useQuery({
    queryKey: [INVOICES_QUERY_KEY, params],
    queryFn: () => invoicesApi.getInvoices(params),
    staleTime: 1000 * 60 * 2,
  });
};

// ============================================================
// 2. HOOK POUR LE DÉTAIL D'UNE FACTURE
// ============================================================
export const useInvoiceDetail = (id: number | null) => {
  return useQuery({
    queryKey: [INVOICES_QUERY_KEY, "detail", id],
    queryFn: () => invoicesApi.getInvoiceById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });
};

// ============================================================
// 3. HOOK POUR LES MUTATIONS
// ============================================================
export const useInvoiceMutations = () => {
  const queryClient = useQueryClient();

  const invalidateInvoices = () => {
    queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
  };

  // Mise à jour partielle
  const updateInvoiceMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateInvoiceRequest }) =>
      invoicesApi.updateInvoice(id, data),
    onSuccess: (_, { id }) => {
      toast.success("Facture mise à jour avec succès");
      invalidateInvoices();
      queryClient.invalidateQueries({
        queryKey: [INVOICES_QUERY_KEY, "detail", id],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de la mise à jour");
    },
  });

  // Marquer comme livrée
  const markDeliveredMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: MarkInvoiceDeliveredRequest;
    }) => invoicesApi.markAsDelivered(id, data),
    onSuccess: (_, { id }) => {
      toast.success("Facture marquée comme livrée");
      invalidateInvoices();
      queryClient.invalidateQueries({
        queryKey: [INVOICES_QUERY_KEY, "detail", id],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec du marquage de la facture");
    },
  });

  // Ajout d'un paiement
  const addPaymentMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: AddPaymentRequest }) =>
      invoicesApi.addPayment(id, data),
    onSuccess: (_, { id }) => {
      toast.success("Paiement ajouté avec succès");
      queryClient.invalidateQueries({
        queryKey: [INVOICES_QUERY_KEY, "detail", id],
      });
      invalidateInvoices();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de l'ajout du paiement");
    },
  });

  // Suppression d'un paiement
  const deletePaymentMutation = useMutation({
    mutationFn: (paymentId: number) => invoicesApi.deletePayment(paymentId),
    onSuccess: () => {
      toast.success("Paiement supprimé avec succès");
      invalidateInvoices();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de la suppression du paiement");
    },
  });

  // Suppression d'une facture (soft delete)
  const deleteInvoiceMutation = useMutation({
    mutationFn: (id: number) => invoicesApi.deleteInvoice(id),
    onSuccess: () => {
      toast.success("Facture supprimée avec succès");
      invalidateInvoices();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de la suppression de la facture");
    },
  });

  // Restaurer une facture
  const restoreInvoiceMutation = useMutation({
    mutationFn: (id: number) => invoicesApi.restoreInvoice(id),
    onSuccess: (_, id) => {
      toast.success("Facture restaurée avec succès");
      invalidateInvoices();
      queryClient.invalidateQueries({
        queryKey: [INVOICES_QUERY_KEY, "detail", id],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de la restauration de la facture");
    },
  });

  return {
    updateInvoiceMutation,
    markDeliveredMutation,
    addPaymentMutation,
    deletePaymentMutation,
    deleteInvoiceMutation,
    restoreInvoiceMutation,
  };
};
