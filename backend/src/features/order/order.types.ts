import { z } from "zod";
import { Prisma } from "@/generated/prisma/client.js";
import {
  createBulkOrderSchema,
  createSingleOrderLineSchema,
} from "./order.schema.js";

export type CreateSingleOrderLineInput = z.infer<
  typeof createSingleOrderLineSchema
>;
export type CreateBulkOrderInput = z.infer<typeof createBulkOrderSchema>;

export const orderFullSelect = {
  id: true,
  reference: true,
  designation: true,
  label: true,
  dimensions: true,
  clientId: true,
  quoteId: true,
  invoiceId: true,
  productId: true,
  status: true,
  quantity: true,
  unitPrice: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
  files: true,
  notes: true,
} as const;

export type FullOrderOutput = Prisma.OrderGetPayload<{
  select: typeof orderFullSelect;
}>;

export interface PaginatedOrderList {
  data: FullOrderOutput[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
    search?: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
  };
}
