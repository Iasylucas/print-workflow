// import type z from "zod";
// import type { createClientSchema } from "../schema/client.schema";

// types exportés pour le frontend (simplifiés, sans Prisma)
export type Client = {
  id: string;
  firstName: string | null;
  lastName: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ClientsQueryParams = {
  page: number;
  limit: number;
  search: string;
  sortBy: "createdAt" | "lastName" | "firstName";
  sortOrder: "asc" | "desc";
};

export type PaginatedClientsResponse = {
  data: Client[];
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
};

export type CreateClientRequest = {
  firstName: string;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
};
export type UpdateClientRequest = Partial<CreateClientRequest>;
