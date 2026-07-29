// src/features/client/services/clientApi.ts
import { api } from "@/lib/axios";
import { unwrap } from "@/lib/apiUtils";
import type { ApiResponse } from "@/shared/types/";
import type { Client, ClientsQueryParams } from "../types/client.types";

export const clientApi = {
  getClients: (params?: ClientsQueryParams) =>
    api.get<ApiResponse<Client[]>>("/clients", { params }).then(unwrap),
};
