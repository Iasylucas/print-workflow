// src/features/client/types/client.types.ts
export type Client = {
  id: string;
  firstName?: string | null;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  createdAt: string;
  updatedAt: string;
};
