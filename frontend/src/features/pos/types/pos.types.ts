import type { OrderDetail } from "@/features/orders/types/orders.types";
export type { Product } from "@/shared/types/product.types";

// types for cart
export interface PosCartLine {
  id?: number;
  designation: string;
  productId?: number | null;
  dimensions?: string | null;
  label?: string | null;
  quantity: number;
  unitPrice: number;
  atelierNote?: string | null;
}

// types for requests
export interface CreateBulkOrderRequest {
  clientId: string;
  documentType: "INVOICE" | "QUOTE";
  deposit: number;
  deliveryPlace?: string | null;
  expectedDeliveryDate?: string | null;
  paymentMethod?: string;
  lines: PosCartLine[];
}

export interface UpdateOrderLine {
  orderId?: number | null;
  productId?: number | null;
  designation: string;
  label?: string | null;
  dimensions?: string | null;
  quantity: number;
  unitPrice: number;
  atelierNote?: string | null;
}

export interface updateInvoiceFromPosRequest {
  deposit?: number;
  deliveryPlace?: string | null;
  expectedDeliveryDate?: string | null;
  lines?: UpdateOrderLine[];
  newPayment?: {
    amount: number;
    method: string;
    reference?: string | null;
  };
}

// types for responeses
export interface BulkOrderResponse {
  documentType: "INVOICE" | "QUOTE";
  documentNumber: string;
  total: number;
}

export interface UpdateInvoiceResponse {
  id: number;
  number: string;
  total: number;
  deposit: number;
  remaining: number;
  paymentStatus: string;
  isDelivered: boolean;
  clientId: string;
  orders: OrderDetail[];
}

export interface InvoicePaymentsResponse {
  payments: payments[];
}

// UI state

export interface payments {
  id: number;
  amount: number;
  method: "CASH" | "MOBILE_MONEY" | "BANK_TRANSFER" | "CHECK";
  reference: string | null;
  date: string;
  receivedById: string;
  receivedBy: {
    id: string;
    firstName: string;
    lastName: string;
  };
}
export interface PosFormState {
  selectedClientId: string;
  deposit: number;
  documentType: "INVOICE" | "QUOTE";
  deliveryPlace: string;
  expectedDeliveryDate: string;
  paymentMethod: "CASH" | "MOBILE_MONEY" | "BANK_TRANSFER" | "CHECK";
  cartLines: PosCartLine[];
}

export type PendingAction =
  | { type: "newOrder" }
  | { type: "cancelEdit" }
  | { type: "deletePayment"; paymentId: number };

// types for pos details
export interface PosInvoiceDetail {
  id: number;
  number: string;
  date: string;
  clientId: string;
  client: {
    id: string;
    firstName: string;
    lastName: string;
  };
  total: number;
  deposit: number;
  deliveryPlace: string | null;
  expectedDeliveryDate: string | null;
  isDelivered: boolean;
  paymentStatus: string;
  companyInfoId: number;
  companyInfo: {
    nif: string;
    stat: string;
    mainAddress: string;
    secondaryAddress: string | null;
    logo: string | null;
    stamp: string | null;
    mobileMoneyNumbers: string | null;
    standardPhone: string | null;
    contactEmail: string | null;
    termsAndConditions: string | null;
    deliveryLeadTime: string | null;
    bankAccountHolder: string | null;
    bankBranch: string | null;
    bankCode: string | null;
    ribInfo: string | null;
  };
  createdById: string;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
  _count: {
    orders: number;
    payments: number;
  };
  orders: {
    id: number;
    reference: string;
    designation: string;
    label: string | null;
    dimensions: string | null;
    quantity: number;
    unitPrice: number;
    status: string;
    clientId: string;
    client: {
      id: string;
      firstName: string;
      lastName: string;
    };
    product: {
      id: number;
      name: string;
    } | null;
    files: {
      id: number;
      url: string;
      category: string;
    }[];
    notes: {
      id: number;
      text: string;
      userId: string;
      user: {
        id: string;
        firstName: string;
        lastName: string;
      };
      createdAt: string;
    }[];
  }[];
  payments: {
    id: number;
    amount: number;
    method: string;
    reference: string | null;
    date: string;
    receivedById: string;
    receivedBy: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }[];
}
