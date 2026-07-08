import { api } from "@/lib/axios";
import { unwrap } from "@/lib/apiUtils";
import type { ApiResponse } from "@/shared/types/";
import type {
  Client,
  ClientsQueryParams,
  PaginatedClientsResponse,
  CreateClientRequest,
  UpdateClientRequest,
} from "../types/client.types";

export const clientApi = {
  // Lister les clients (paginé, filtré, trié)
  getClients: (params?: ClientsQueryParams) =>
    api
      .get<ApiResponse<PaginatedClientsResponse>>("/clients", { params })
      .then(unwrap),

  // Récupérer un client par ID
  getClientById: (id: string) =>
    api.get<ApiResponse<Client>>(`/clients/${id}`).then(unwrap),

  // Créer un client
  createClient: (data: CreateClientRequest) =>
    api.post<ApiResponse<Client>>("/clients", data).then(unwrap),

  // Mettre à jour un client
  updateClient: (id: string, data: UpdateClientRequest) =>
    api.patch<ApiResponse<Client>>(`/clients/${id}`, data).then(unwrap),

  // Supprimer un client (soft delete)
  deleteClient: (id: string) =>
    api
      .delete<{ success: boolean; message: string }>(`/clients/${id}`)
      .then((res) => res.data),
};
