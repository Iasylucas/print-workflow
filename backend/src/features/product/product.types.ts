import { z } from "zod";
import { PricingMode } from "@/generated/prisma/client.js";
import {
  createProductSchema,
  updateProductSchema,
  createProductVariantSchema,
  createPricingRuleSchema,
  pricingConfigSchema,
  productQuerySchema,
} from "./product.schema.js";

// Objet de sélection Prisma pour regrouper un produit, ses variantes et ses règles en une seule requête
export const productSelect = {
  id: true,
  name: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
  variants: {
    include: {
      pricingRules: true,
    },
  },
} as const;

// 1. Extraction des types de payloads issus des validations Zod (Entrées de l'API)
export type PricingConfigInput = z.infer<typeof pricingConfigSchema>;
export type CreatePricingRuleInput = z.infer<typeof createPricingRuleSchema>;
export type CreateProductVariantInput = z.infer<
  typeof createProductVariantSchema
>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

// =========================================================================
// TYPES DE SORTIES / RETOURS DE LA BASE DE DONNÉES (AGRÉGATS PRISMA)
// =========================================================================

// Représentation typée stricte du champ JSON décodé depuis la base de données
export interface PricingConfigOutput {
  [key: string]: number; // "A4" -> 10000, "per_m2" -> 22000
}

// Interface pour le modèle de règle tarifaire
export interface PricingRuleOutput {
  id: number;
  variantId: number;
  pricingMode: PricingMode;
  config: PricingConfigOutput;
  createdAt: Date;
  updatedAt: Date;
}

// Interface pour le modèle de variante
export interface ProductVariantOutput {
  id: number;
  productId: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  pricingRules: PricingRuleOutput[]; // Tableau imbriqué pour correspondre au findMany
}

// L'Agrégat Final de Sortie : Représente le produit complet extrait de PostgreSQL
// C'est ce type que le POS du commercial et la table admin vont consommer
export interface FullProductOutput {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  variants: ProductVariantOutput[];
}

export type ProductQuery = z.infer<typeof productQuerySchema>;

// Contrat de retour standardisé et paginé pour les Produits
export interface PaginatedProductList {
  data: FullProductOutput[];
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
