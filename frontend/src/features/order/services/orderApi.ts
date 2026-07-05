import { api } from "@/lib/axios";
import { unwrap } from "@/lib/apiUtils";
import type { ApiResponse } from "@/shared/types/";
import type {
  CreateBulkOrderRequest,
  BulkOrderResponse,
} from "../types/order.types";

export const orderApi = {
  createBulkOrder: (data: CreateBulkOrderRequest) =>
    api.post<ApiResponse<BulkOrderResponse>>("/orders/bulk", data).then(unwrap),
  // À ajouter dans l'objet orderApi existant :
  getProductsCatalog: () =>
    api
      .get<ApiResponse<any>>("/products") // Cible votre route backend
      .then(unwrap),
};
