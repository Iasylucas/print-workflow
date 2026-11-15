import { api } from "@/lib/axios";
import { unwrap } from "@/lib/apiUtils";
import type { ApiResponse } from "@/shared/types";
import type { OrderStatusHistoryListResponse } from "../types/order-status-history.types";

export const orderStatusHistoryApi = {
  getByOrderId: (orderId: number) =>
    api
      .get<ApiResponse<OrderStatusHistoryListResponse>>(
        `/order-status-history/order/${orderId}`,
      )
      .then(unwrap),
};