import type { OrderStatus } from "./orders.types";

export type OrderStatusHistoryEntry = {
  id: number;
  orderId: number;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  changedById: string;
  changedBy: {
    id: string;
    firstName: string | null;
    lastName: string;
  };
  createdAt: string;
};

export type OrderStatusHistoryListResponse = OrderStatusHistoryEntry[];
