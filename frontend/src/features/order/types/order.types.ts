export type OrderOptionValue = string | number | boolean;

export interface PosCartLine {
  designation: string;
  variantId: number;
  pricingRuleId: number;
  widthCm?: number | null;
  heightCm?: number | null;
  options?: Record<string, OrderOptionValue> | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  atelierNote?: string | null;
}

export interface CreateBulkOrderRequest {
  clientId: string;
  documentType: "INVOICE" | "QUOTE";
  deposit: number;
  deliveryPlace?: string | null;
  expectedDeliveryDate?: string | null;
  lines: PosCartLine[];
}

export interface BulkOrderResponse {
  documentType: "INVOICE" | "QUOTE";
  documentNumber: string;
  total: number;
}
