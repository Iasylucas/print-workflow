// frontend/src/features/orders/hooks/useOrders.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "../services/ordersApi";
import type {
  OrdersQueryParams,
  UpdateOrderRequest,
  UpdateOrderStatusRequest,
  AddOrderNoteRequest,
  AddOrderFileRequest,
} from "../types/orders.types";
import { toast } from "sonner";

const ORDERS_QUERY_KEY = "orders";

// ============================================================
// 1. HOOK POUR LA LISTE PAGINÉE
// ============================================================
export const useOrders = (params: OrdersQueryParams) => {
  return useQuery({
    queryKey: [ORDERS_QUERY_KEY, params],
    queryFn: () => ordersApi.getOrders(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// ============================================================
// 2. HOOK POUR LE DÉTAIL D'UNE COMMANDE
// ============================================================
export const useOrderDetail = (id: number | null) => {
  return useQuery({
    queryKey: [ORDERS_QUERY_KEY, "detail", id],
    queryFn: () => ordersApi.getOrderById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });
};

// ============================================================
// 3. HOOK POUR LES MUTATIONS
// ============================================================
export const useOrderMutations = () => {
  const queryClient = useQueryClient();

  const invalidateOrders = () => {
    queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
  };

  // Mise à jour partielle
  const updateOrderMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateOrderRequest }) =>
      ordersApi.updateOrder(id, data),
    onSuccess: (_, { id }) => {
      toast.success("Commande mise à jour avec succès");
      invalidateOrders();
      queryClient.invalidateQueries({
        queryKey: [ORDERS_QUERY_KEY, "detail", id],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de la mise à jour");
    },
  });

  // Mise à jour du statut
  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateOrderStatusRequest;
    }) => ordersApi.updateOrderStatus(id, data),
    onSuccess: (_, { id }) => {
      toast.success("Statut mis à jour avec succès");
      invalidateOrders();
      queryClient.invalidateQueries({
        queryKey: [ORDERS_QUERY_KEY, "detail", id],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de la mise à jour du statut");
    },
  });

  // Ajout d'une note
  const addNoteMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: AddOrderNoteRequest }) =>
      ordersApi.addOrderNote(id, data),
    onSuccess: (_, { id }) => {
      toast.success("Note ajoutée avec succès");
      queryClient.invalidateQueries({
        queryKey: [ORDERS_QUERY_KEY, "detail", id],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de l'ajout de la note");
    },
  });

  // Ajout d'un fichier
  const addFileMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: AddOrderFileRequest }) =>
      ordersApi.addOrderFile(id, data),
    onSuccess: (_, { id }) => {
      toast.success("Fichier ajouté avec succès");
      queryClient.invalidateQueries({
        queryKey: [ORDERS_QUERY_KEY, "detail", id],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de l'ajout du fichier");
    },
  });

  // Suppression d'une note
  const deleteNoteMutation = useMutation({
    mutationFn: (noteId: number) => ordersApi.deleteOrderNote(noteId),
    onSuccess: () => {
      toast.success("Note supprimée avec succès");
      invalidateOrders();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de la suppression de la note");
    },
  });

  // Suppression d'un fichier
  const deleteFileMutation = useMutation({
    mutationFn: (fileId: number) => ordersApi.deleteOrderFile(fileId),
    onSuccess: () => {
      toast.success("Fichier supprimé avec succès");
      invalidateOrders();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de la suppression du fichier");
    },
  });

  return {
    updateOrderMutation,
    updateStatusMutation,
    addNoteMutation,
    addFileMutation,
    deleteNoteMutation,
    deleteFileMutation,
  };
};
