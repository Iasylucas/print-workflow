// frontend/src/features/orders/services/ordersApi.ts
import { api } from "@/lib/axios";
import { unwrap } from "@/lib/apiUtils";
import type { ApiResponse } from "@/shared/types/";
import type {
  OrderDetail,
  OrdersQueryParams,
  PaginatedOrdersResponse,
  UpdateOrderRequest,
  UpdateOrderStatusRequest,
  AddOrderNoteRequest,
  AddOrderFileRequest,
} from "../types/orders.types";

export const ordersApi = {
  // ============================================================
  // LISTE PAGINÉE DES COMMANDES
  // ============================================================
  getOrders: (params?: OrdersQueryParams) =>
    api
      .get<ApiResponse<PaginatedOrdersResponse>>("/orders", { params })
      .then(unwrap),

  // ============================================================
  // DÉTAIL D'UNE COMMANDE
  // ============================================================
  getOrderById: (id: number) =>
    api.get<ApiResponse<OrderDetail>>(`/orders/${id}`).then(unwrap),

  // ============================================================
  // MISE À JOUR PARTIELLE
  // ============================================================
  updateOrder: (id: number, data: UpdateOrderRequest) =>
    api.patch<ApiResponse<OrderDetail>>(`/orders/${id}`, data).then(unwrap),

  // ============================================================
  // MISE À JOUR DU STATUT
  // ============================================================
  updateOrderStatus: (id: number, data: UpdateOrderStatusRequest) =>
    api
      .patch<ApiResponse<OrderDetail>>(`/orders/${id}/status`, data)
      .then(unwrap),

  // ============================================================
  // AJOUT D'UNE NOTE
  // ============================================================
  addOrderNote: (id: number, data: AddOrderNoteRequest) =>
    api
      .post<
        ApiResponse<{ id: number; text: string; createdAt: string }>
      >(`/orders/${id}/notes`, data)
      .then(unwrap),

  // ============================================================
  // AJOUT D'UN FICHIER
  // ============================================================
  addOrderFile: (id: number, data: AddOrderFileRequest) =>
    api
      .post<
        ApiResponse<{
          id: number;
          url: string;
          category: string;
          createdAt: string;
        }>
      >(`/orders/${id}/files`, data)
      .then(unwrap),

  // ============================================================
  // SUPPRESSION D'UNE NOTE
  // ============================================================
  deleteOrderNote: (noteId: number) =>
    api
      .delete<
        ApiResponse<{ success: boolean; message: string }>
      >(`/orders/notes/${noteId}`)
      .then(unwrap),

  // ============================================================
  // SUPPRESSION D'UN FICHIER
  // ============================================================
  deleteOrderFile: (fileId: number) =>
    api
      .delete<
        ApiResponse<{ success: boolean; message: string }>
      >(`/orders/files/${fileId}`)
      .then(unwrap),
};
