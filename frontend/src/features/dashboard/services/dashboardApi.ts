import { api } from "@/lib/axios";
import { unwrap } from "@/lib/apiUtils";
import type { ApiResponse } from "@/shared/types/";
import type { DashboardStats, PaymentsTrend } from "../types/dashboard.types";

export const dashboardApi = {
  getStats: () =>
    api.get<ApiResponse<DashboardStats>>("/dashboard/stats").then(unwrap),

  getPaymentsTrend: () =>
    api
      .get<ApiResponse<PaymentsTrend>>("/dashboard/payments-trend")
      .then(unwrap),
};
