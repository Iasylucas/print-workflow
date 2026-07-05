import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "../services/orderApi";
import type { CreateBulkOrderRequest } from "../types/order.types";
import { toast } from "sonner";

export const useOrderMutations = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  const createBulkOrderMutation = useMutation({
    mutationFn: (data: CreateBulkOrderRequest) =>
      orderApi.createBulkOrder(data),

    onSuccess: (result) => {
      const docName = result.documentType === "INVOICE" ? "Facture" : "Devis";
      toast.success(`${docName} généré avec succès : ${result.documentNumber}`);

      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },

    onError: (error: Error) => {
      toast.error(error.message || "Échec de la validation de la commande");
    },
  });

  return { createBulkOrderMutation };
};

export const useProductsCatalog = () => {
  return useQuery({
    queryKey: ["products-catalog"],
    queryFn: () => orderApi.getProductsCatalog(),
    staleTime: 1000 * 60 * 5, // Le catalogue change rarement, on garde en cache 5 minutes
  });
};
