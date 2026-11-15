import { useQuery } from "@tanstack/react-query";
import { orderStatusHistoryApi } from "../services/orderStatusHistoryApi";

export const useOrderStatusHistory = (orderId: number | null) => {
  return useQuery({
    queryKey: ["order-status-history", orderId],
    queryFn: () => orderStatusHistoryApi.getByOrderId(orderId!),
    enabled: !!orderId,
    staleTime: 30_000,
  });
};