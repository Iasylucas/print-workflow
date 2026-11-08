import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../services/dashboardApi";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: dashboardApi.getStats,
    staleTime: 30_000,
  });
};
