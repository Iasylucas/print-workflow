import { api } from "@/lib/axios";
import { unwrap } from "@/lib/apiUtils";
import type { ApiResponse, PaginatedResponse } from "@/shared/types/";
import type {
  CreateBulkOrderRequest,
  BulkOrderResponse,
  Product,
  PosInvoiceDetail,
  updateInvoiceFromPosRequest,
  InvoicePaymentsResponse,
  UpdateInvoiceResponse,
} from "../types/pos.types";

export const orderApi = {
  getProductsCatalog: () =>
    api.get<ApiResponse<PaginatedResponse<Product>>>("/products").then(unwrap),

  createBulkOrder: (data: CreateBulkOrderRequest) =>
    api.post<ApiResponse<BulkOrderResponse>>("/pos/bulk", data).then(unwrap),

  updateInvoiceFromPos: (
    invoiceId: number,
    data: updateInvoiceFromPosRequest,
  ) =>
    api
      .patch<ApiResponse<UpdateInvoiceResponse>>(`/pos/${invoiceId}/`, data)
      .then(unwrap),

  getInvoiceForPos: (invoiceId: number) =>
    api
      .get<ApiResponse<PosInvoiceDetail>>(`/pos/invoice/${invoiceId}/`)
      .then(unwrap),

  getInvoicePayments: (invoiceId: number) =>
    api
      .get<
        ApiResponse<InvoicePaymentsResponse>
      >(`/pos/invoice/${invoiceId}/payments`)
      .then(unwrap),
};
