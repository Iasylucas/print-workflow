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

export type PricingConfigInput = z.infer<typeof pricingConfigSchema>;
export type CreatePricingRuleInput = z.infer<typeof createPricingRuleSchema>;
export type CreateProductVariantInput = z.infer<
  typeof createProductVariantSchema
>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export interface PricingConfigOutput {
  [key: string]: number;
}

export interface PricingRuleOutput {
  id: number;
  variantId: number;
  pricingMode: PricingMode;
  config: PricingConfigOutput;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariantOutput {
  id: number;
  productId: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  pricingRules: PricingRuleOutput[];
}

export interface FullProductOutput {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  variants: ProductVariantOutput[];
}

export type ProductQuery = z.infer<typeof productQuerySchema>;

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
