// frontend/src/features/quotes/types/quotes.types.ts
import type { CompanyInfo } from "@/features/company-info/types/company.types";
import type { QuoteStatus } from "../schema/quotes.schema";
import type { Order } from "@/features/orders/types/orders.types";

// ============================================================
// 1. DEVIS
// ============================================================
export type Quote = {
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
  status: QuoteStatus;
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
  };
};

// ============================================================
// 2. DEVIS AVEC DÉTAILS (commandes)
// ============================================================
export type QuoteDetail = Quote & {
  companyInfo: CompanyInfo;
  orders: Order[];
};

// ============================================================
// 3. TYPES DE REQUÊTE
// ============================================================
export type QuotesQueryParams = {
  page?: number;
  limit: number;
  search?: string;
  status?: QuoteStatus;
  clientId?: string;
  startDate?: string;
  endDate?: string;
  sortBy:
    | "createdAt"
    | "updatedAt"
    | "number"
    | "total"
    | "clientId"
    | "status";
  sortOrder: "asc" | "desc";
};

export type UpdateQuoteRequest = {
  status?: QuoteStatus;
};

// ============================================================
// 4. TYPES DE RÉPONSE
// ============================================================
export type PaginatedQuotesResponse = {
  data: Quote[];
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
