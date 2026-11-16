export type Notification = {
  id: number;
  userId: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  orderId: number | null;
  metadata: Record<string, unknown> | null;
  readAt: string | null;
  createdAt: string;
};

export type NotificationsMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
};

export type PaginatedNotificationsResponse = {
  data: Notification[];
  meta: NotificationsMeta;
};

export type UnreadCountResponse = {
  count: number;
};

export type NotificationsQueryParams = {
  page: number;
  limit: number;
  unreadOnly?: boolean;
};