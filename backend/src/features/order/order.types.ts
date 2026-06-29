import { z } from "zod";
import { Prisma } from "@/generated/prisma/client.js";
import {
  createBulkOrderSchema,
  createSingleOrderLineSchema,
} from "./order.schema.js";

// 1. Extraction des types d'entrées API (Infrés depuis Zod)
export type CreateSingleOrderLineInput = z.infer<
  typeof createSingleOrderLineSchema
>;
export type CreateBulkOrderInput = z.infer<typeof createBulkOrderSchema>;

// =========================================================================
// TYPES DE SORTIES / RETOURS DE LA BASE DE DONNÉES (AGRÉGATS PRISMA PRO)
// =========================================================================

// Déclaration de la sélection stricte pour récupérer une commande avec ses dépendances
export const orderFullSelect = {
  id: true,
  reference: true,
  designation: true,
  clientId: true,
  quoteId: true,
  invoiceId: true,
  variantId: true,
  pricingRuleId: true,
  options: true,
  widthCm: true,
  heightCm: true,
  status: true,
  quantity: true,
  unitPrice: true,
  totalPrice: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
  // Inclusion automatique de la liste des maquettes graphiques et des consignes d'atelier
  files: true,
  notes: true,
} as const;

// Type Payload officiel généré par Prisma pour garantir l'absence de "as unknown as" ou de "any"
export type FullOrderOutput = Prisma.OrderGetPayload<{
  select: typeof orderFullSelect;
}>;

// Structure de retour paginée pour la liste des commandes de l'administration
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
