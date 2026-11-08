import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../services/dashboardApi";

export const usePaymentsTrend = () => {
  return useQuery({
    queryKey: ["dashboard", "payments-trend"],
    queryFn: dashboardApi.getPaymentsTrend,
    staleTime: 5 * 60_000,
  });
};
