import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "../services/notificationsApi";

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: notificationsApi.getUnreadCount,
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
    staleTime: 10_000,
  });
};