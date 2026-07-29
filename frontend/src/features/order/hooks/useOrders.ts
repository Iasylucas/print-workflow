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

  const updateOrderFromPosMutation = useMutation({
    mutationFn: ({ invoiceId, data }: { invoiceId: number; data: any }) =>
      orderApi.updateOrderFromPos(invoiceId, data),
    onSuccess: (_, { invoiceId }) => {
      // ← AJOUTER invoiceId dans les paramètres
      toast.success("Facture mise à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      // ✅ INVALIDER LE DÉTAIL DE LA FACTURE
      queryClient.invalidateQueries({
        queryKey: ["invoices", "detail", invoiceId],
      });
      // console.log("🔴 Invalidating:", ["order", "pos", invoiceId]);
      queryClient.invalidateQueries({
        queryKey: ["order", "pos", invoiceId],
      });
      // 1. Appel de l'invalidation
      queryClient.invalidateQueries({
        queryKey: ["order", "pos", invoiceId],
      });

      // 2. 🟢 CODE DE VÉRIFICATION DU SUCCÈS
      // On récupère la requête directement depuis le cœur du cache
      const query = queryClient.getQueryCache().find({
        queryKey: ["order", "pos", invoiceId],
      });

      if (!query) {
        console.error(
          `❌ ÉCHEC : Aucune requête trouvée dans le cache pour la clé`,
          ["order", "pos", invoiceId],
        );
      } else {
        // La marque du succès d'une invalidation est "isStale(): true"
        const isStale = query.isStale();
        console.log(
          `✅ SUCCÈS : Requête trouvée ! Est-elle marquée comme périmée (stale) ?`,
          isStale,
        );
        console.log(
          `Statut interne actuel de la requête :`,
          query.state.status,
        ); // "success", "pending", etc.
      }
      // if (onSuccessCallback) onSuccessCallback();
    },
  });

  return { createBulkOrderMutation, updateOrderFromPosMutation };
};

export const useInvoiceForPos = (invoiceId: number | null) => {
  // console.log("query cree " + "order", "pos", invoiceId);

  return useQuery({
    queryKey: ["order", "pos", invoiceId],
    queryFn: () => orderApi.getOrderForPos(invoiceId!),
    enabled: !!invoiceId,
    retry: 1,
    staleTime: 0,
  });
};

// useOrders.ts
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
    staleTime: 1000 * 60 * 5, // Le catalogue change rarement, on garde en cache 5 minutes
  });
};
