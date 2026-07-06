// src/features/client/services/clientApi.ts
import { api } from "@/lib/axios";
import { unwrap } from "@/lib/apiUtils";
import type { ApiResponse } from "@/shared/types/";
import type { Client } from "../types/clientTypes";

export const clientApi = {
  getClients: () => api.get<ApiResponse<Client[]>>("/clients").then(unwrap),
};
