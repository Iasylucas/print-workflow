import { Prisma } from "@/generated/prisma/client.js";
import { z } from "zod";
import { orderStatusHistoryQuerySchema } from "./order-status-history.schema.js";

export const orderStatusHistorySelect = {
  id: true,
  orderId: true,
  fromStatus: true,
  toStatus: true,
  changedById: true,
  changedBy: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  },
  createdAt: true,
} satisfies Prisma.OrderStatusHistorySelect;

export type OrderStatusHistoryOutput = Prisma.OrderStatusHistoryGetPayload<{
  select: typeof orderStatusHistorySelect;
}>;

export type OrderStatusHistoryQuery = z.infer<
  typeof orderStatusHistoryQuerySchema
>;

export type PaginatedOrderStatusHistoryList = {
  data: OrderStatusHistoryOutput[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
};

export type CreateOrderStatusHistoryInput = {
  orderId: number;
  fromStatus: string | null;
  toStatus: string;
  changedById: string;
};
