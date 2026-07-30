import { api } from "@/lib/axios";
import { unwrap } from "@/lib/apiUtils";
import type { ApiResponse } from "@/shared/types/";
import type {
  CreateBulkOrderRequest,
  BulkOrderResponse,
} from "../types/order.types";

export const orderApi = {
  createBulkOrder: (data: CreateBulkOrderRequest) =>
    api.post<ApiResponse<BulkOrderResponse>>("/pos/bulk", data).then(unwrap),

  getProductsCatalog: () => api.get<ApiResponse<any>>("/products").then(unwrap),

  updateOrderFromPos: (invoiceId: number, data: any) =>
    api.patch(`/pos/${invoiceId}/`, data).then(unwrap),

  getOrderForPos: (orderId: number) =>
    api.get<ApiResponse<any>>(`/pos/invoice/${orderId}/`).then(unwrap),

  // orderApi.ts
  getInvoicePayments: (invoiceId: number) =>
    api.get(`/pos/invoice/${invoiceId}/payments`).then(unwrap),
};
