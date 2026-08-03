// frontend/src/features/orders/types/orders.types.ts
import type { OrderStatus } from "../schema/orders.schema";

// ============================================================
// 1. TYPES DE BASE
// ============================================================

export type Order = {
  id: number;
  reference: string;
  designation: string;
  label: string | null;
  dimensions: string | null;
  clientId: string;
  client: {
    id: string;
    firstName: string | null;
    lastName: string;
  };
  productId: number | null;
  product: {
    id: number;
    name: string;
  } | null;
  quantity: number;
  unitPrice: number;
  status: OrderStatus;
  invoiceId: number | null;
  quoteId: number | null;
  createdById: string;
  createdBy: {
    id: string;
    firstName: string | null;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
  _count: {
    files: number;
    notes: number;
  };
  invoice: {
    number: string;
  } | null;
  quote: {
    number: string;
  } | null;
};

export type OrderDetail = Order & {
  files: {
    id: number;
    url: string;
    category: "client_visual" | "final_print";
    uploadedById: string;
    uploadedBy: {
      id: string;
      firstName: string | null;
      lastName: string;
    };
    createdAt: string;
  }[];
  notes: {
    id: number;
    text: string;
    userId: string;
    user: {
      id: string;
      firstName: string | null;
      lastName: string;
    };
    createdAt: string;
  }[];
};

// ============================================================
// 2. TYPES DE REQUÊTE
// ============================================================

export type OrdersQueryParams = {
  page?: number;
  limit: number;
  search?: string;
  status?: OrderStatus;
  clientId?: string;
  sortBy: "createdAt" | "updatedAt" | "status" | "designation" | "clientId";
  sortOrder: "asc" | "desc";
  startDate?: string;
  endDate?: string;
};

export type UpdateOrderRequest = {
  designation?: string;
  label?: string | null;
  dimensions?: string | null;
  quantity?: number;
  unitPrice?: number;
};

export type UpdateOrderStatusRequest = {
  status: OrderStatus;
};

export type AddOrderNoteRequest = {
  text: string;
};

export type AddOrderFileRequest = {
  url: string;
  category: "client_visual" | "final_print";
};

// ============================================================
// 3. TYPES DE RÉPONSE
// ============================================================

export type PaginatedOrdersResponse = {
  data: OrderDetail[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
    search?: string;
    status?: string;
    clientId?: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
  };
};
