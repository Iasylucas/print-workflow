// frontend/src/features/invoices/types/invoices.types.ts
import type { CompanyInfo } from "@/features/company-info/types/company.types";
import type {
  // INVOICE_PAYMENT_STATUSES,
  InvoicePaymentStatus,
  // PAYMENT_METHODS,
  PaymentMethod,
} from "../schema/invoices.schema";
import type { Order } from "@/features/orders/types/orders.types";

// ============================================================
// 1. FACTURE
// ============================================================
export type Invoice = {
  id: number;
  number: string;
  date: string;
  clientId: string;
  client: {
    id: string;
    firstName: string | null;
    lastName: string;
  };
  total: number;
  deposit: number;
  // remaining: number;
  deliveryPlace: string | null;
  expectedDeliveryDate: string | null;
  isDelivered: boolean;
  paymentStatus: InvoicePaymentStatus;
  companyInfoId: number;
  createdById: string;
  createdBy: {
    id: string;
    firstName: string | null;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
  _count: {
    orders: number;
    payments: number;
  };
};

// ============================================================
// 2. FACTURE AVEC DÉTAILS (commandes + paiements)
// ============================================================
export type InvoiceDetail = Invoice & {
  companyInfo: CompanyInfo;
  orders: Order[];
  payments: {
    id: number;
    amount: number;
    method: PaymentMethod;
    reference: string | null;
    date: string;
    receivedById: string;
    receivedBy: {
      id: string;
      firstName: string | null;
      lastName: string;
    };
  }[];
};

// ============================================================
// 3. TYPES DE REQUÊTE
// ============================================================
export type InvoicesQueryParams = {
  page?: number;
  limit: number;
  search?: string;
  status?: InvoicePaymentStatus;
  clientId?: string;
  isDelivered?: boolean | undefined;
  startDate?: string;
  endDate?: string;
  sortBy: "createdAt" | "updatedAt" | "number" | "total" | "clientId";
  sortOrder: "asc" | "desc";
};

export type UpdateInvoiceRequest = {
  deposit?: number;
  deliveryPlace?: string | null;
  expectedDeliveryDate?: string | null;
};

export type AddPaymentRequest = {
  amount: number;
  method: PaymentMethod;
  reference?: string | null;
};

export type MarkInvoiceDeliveredRequest = {
  isDelivered: boolean;
};

// ============================================================
// 4. TYPES DE RÉPONSE
// ============================================================
export type PaginatedInvoicesResponse = {
  data: Invoice[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
    search?: string;
    status?: string;
    clientId?: string;
    isDelivered?: boolean;
    sortBy: string;
    sortOrder: "asc" | "desc";
  };
};

export type MobileMoney = {
  nom?: string;
  numero: string;
};
