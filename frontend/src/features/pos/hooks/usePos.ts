import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "../services/posApi";
import type {
  CreateBulkOrderRequest,
  updateInvoiceFromPosRequest,
} from "../types/pos.types";
import { toast } from "sonner";

export const useInvoiceForPos = (invoiceId: number | null) => {
  return useQuery({
    queryKey: ["pos", "invoice", invoiceId],
    queryFn: () => orderApi.getInvoiceForPos(invoiceId!),
    enabled: !!invoiceId,
    retry: 1,
    staleTime: 0,
  });
};

export const useInvoicePayments = (invoiceId: number | null) => {
  return useQuery({
    queryKey: ["pos", "invoice", invoiceId, "payments"],
    queryFn: () => orderApi.getInvoicePayments(invoiceId!),
    enabled: !!invoiceId,
  });
};

export const useProductsCatalog = () => {
  return useQuery({
    queryKey: ["products-catalog"],
    queryFn: () => orderApi.getProductsCatalog(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useOrderMutations = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  const invalidateInvoice = () => {
    queryClient.invalidateQueries({ queryKey: ["invoices"] });
  };
  const invalidateOrders = () => {
    queryClient.invalidateQueries({ queryKey: ["orders"] });
  };
  const createBulkOrderMutation = useMutation({
    mutationFn: (data: CreateBulkOrderRequest) =>
      orderApi.createBulkOrder(data),

    onSuccess: (result) => {
      const docName = result.documentType === "INVOICE" ? "Facture" : "Devis";
      toast.success(`${docName} généré avec succès : ${result.documentNumber}`);

      invalidateInvoice();
      invalidateOrders();

      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },

    onError: (error: Error) => {
      toast.error(error.message || "Échec de la validation de la commande");
    },
  });

  const updateInvoiceFromPosMutation = useMutation({
    mutationFn: ({
      invoiceId,
      data,
    }: {
      invoiceId: number;
      data: updateInvoiceFromPosRequest;
    }) => orderApi.updateInvoiceFromPos(invoiceId, data),
    onSuccess: (_, { invoiceId }) => {
      toast.success("Facture mise à jour avec succès");
      invalidateOrders();
      invalidateInvoice();
      queryClient.invalidateQueries({
        queryKey: ["pos", "invoice", invoiceId],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de la validation de la commande");
    },
  });

  return { createBulkOrderMutation, updateInvoiceFromPosMutation };
};
