import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "../services/notificationsApi";
import type { NotificationsQueryParams } from "../types/notifications.types";

export const useNotifications = (params: NotificationsQueryParams) => {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => notificationsApi.getNotifications(params),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: 10_000,
  });
};
