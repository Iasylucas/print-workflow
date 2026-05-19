import { Prisma } from "@/generated/prisma/client.js";
import { z } from "zod";
import {
  createClientSchema,
  updateClientSchema,
  clientQuerySchema,
} from "./client.schema.js";

export const clientSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  address: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ClientSelect;

export type ClientSafe = Prisma.ClientGetPayload<{
  select: typeof clientSelect;
}>;

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type ClientQuery = z.infer<typeof clientQuerySchema>;

export type PaginatedClientList = {
  clients: ClientSafe[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  };
};
