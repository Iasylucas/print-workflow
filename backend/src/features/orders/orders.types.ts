import { Prisma } from "@/generated/prisma/client.js";
import { z } from "zod";
import {
  updateOrderStatusSchema,
  addOrderNoteSchema,
  addOrderFileSchema,
  ordersQuerySchema,
  updateOrderSchema,
  orderIdParamSchema,
} from "./orders.schema.js";

export const orderListSelect = {
  id: true,
  reference: true,
  designation: true,
  label: true,
  dimensions: true,
  clientId: true,
  client: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  },
  productId: true,
  product: {
    select: {
      id: true,
      name: true,
    },
  },
  quantity: true,
  unitPrice: true,
  status: true,
  invoiceId: true,
  quoteId: true,
  createdById: true,
  createdBy: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  },
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      files: true,
      notes: true,
    },
  },
  invoice: {
    select: { number: true },
  },
  quote: {
    select: { number: true },
  },
} satisfies Prisma.OrderSelect;

export const orderDetailSelect = {
  ...orderListSelect,
  files: {
    select: {
      id: true,
      url: true,
      category: true,
      uploadedById: true,
      uploadedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      createdAt: true,
    },
  },
  notes: {
    select: {
      id: true,
      text: true,
      userId: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  },
} satisfies Prisma.OrderSelect;

export type OrderListOutput = Prisma.OrderGetPayload<{
  select: typeof orderListSelect;
}>;

export type OrderDetailOutput = Prisma.OrderGetPayload<{
  select: typeof orderDetailSelect;
}>;

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type AddOrderNoteInput = z.infer<typeof addOrderNoteSchema>;
export type AddOrderFileInput = z.infer<typeof addOrderFileSchema>;
export type OrdersQuery = z.infer<typeof ordersQuerySchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;

export type PaginatedOrdersList = {
  data: OrderListOutput[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
    search?: string;
    status?: string;
    clientId?: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
  };
};
