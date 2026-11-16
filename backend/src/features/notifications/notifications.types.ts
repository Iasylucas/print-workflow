import { Prisma } from "@/generated/prisma/client.js";
import { z } from "zod";
import { notificationsQuerySchema } from "./notifications.schema.js";

export const notificationSelect = {
  id: true,
  userId: true,
  type: true,
  title: true,
  message: true,
  link: true,
  orderId: true,
  metadata: true,
  readAt: true,
  createdAt: true,
} satisfies Prisma.NotificationSelect;

export type NotificationOutput = Prisma.NotificationGetPayload<{
  select: typeof notificationSelect;
}>;

export type NotificationsQuery = z.infer<typeof notificationsQuerySchema>;

export type PaginatedNotificationsList = {
  data: NotificationOutput[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
};

export type UnreadCountOutput = {
  count: number;
};

export type CreateNotificationInput = {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string | null;
  orderId?: number | null;
  metadata?: Prisma.InputJsonValue | null;
};