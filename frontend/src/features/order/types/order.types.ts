export type OrderOptionValue = string | number | boolean;

export interface PosCartLine {
  designation: string;
  productId?: number | null;
  dimensions?: string | null;
  label?: string | null;
  quantity: number;
  unitPrice: number;
  atelierNote?: string | null;
}

export interface CreateBulkOrderRequest {
  clientId: string;
  documentType: "INVOICE" | "QUOTE";
  deposit: number;
  deliveryPlace?: string | null;
  expectedDeliveryDate?: string | null;
  paymentMethod?: string;
  lines: PosCartLine[];
}

export interface BulkOrderResponse {
  documentType: "INVOICE" | "QUOTE";
  documentNumber: string;
  total: number;
}
