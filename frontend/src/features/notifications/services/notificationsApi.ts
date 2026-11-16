import { api } from "@/lib/axios";
import { unwrap } from "@/lib/apiUtils";
import type { ApiResponse } from "@/shared/types";
import type {
  NotificationsQueryParams,
  PaginatedNotificationsResponse,
  UnreadCountResponse,
} from "../types/notifications.types";

export const notificationsApi = {
  getNotifications: (params: NotificationsQueryParams) =>
    api
      .get<ApiResponse<PaginatedNotificationsResponse>>("/notifications", {
        params,
      })
      .then(unwrap),

  getUnreadCount: () =>
    api
      .get<ApiResponse<UnreadCountResponse>>("/notifications/unread-count")
      .then(unwrap),

  markAsRead: (id: number) =>
    api.patch<ApiResponse<null>>(`/notifications/${id}/read`).then(unwrap),

  markAllAsRead: () =>
    api.patch<ApiResponse<null>>("/notifications/read-all").then(unwrap),
};
