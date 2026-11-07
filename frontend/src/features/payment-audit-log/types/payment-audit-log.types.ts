// ============================================================
// 1. TYPES POUR LES ENTRÉES D'AUDIT
// ============================================================
export type PaymentAuditAction = "CREATE" | "UPDATE" | "DELETE";

export interface PaymentAuditLogQueryParams {
  page?: number;
  limit?: number;
  invoiceNumber?: string;
  action?: PaymentAuditAction;
  userId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface PaymentAuditLog {
  id: string;
  action: PaymentAuditAction;
  invoiceNumber?: string;
  userId: string;
  user: {
    id: string;
    firstName: string | null;
    lastName: string;
  };
  oldData: Record<string, unknown> | null;
  newData: Record<string, unknown> | null;
  reason: string | null;
  createdAt: string;
}

// ============================================================
// 2. RÉPONSE PAGINÉE
// ============================================================
export interface PaginatedPaymentAuditLogsResponse {
  data: PaymentAuditLog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
    sortBy: string;
    sortOrder: "asc" | "desc";
  };
}

// ============================================================
// 3. TYPE STATS
// ============================================================
export interface PaymentAuditLogStats {
  totalActions: number;
  totalCreations: number;
  totalDeletions: number;
  revenue: number;
}
