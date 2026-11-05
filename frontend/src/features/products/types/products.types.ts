import type { ProductsQueryParams } from "../schema/products.schema";

export interface PricingConfig {
  [key: string]: number;
}

export interface PricingRule {
  id: number;
  variantId: number;
  pricingMode: string;
  config: PricingConfig;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: number;
  productId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  pricingRules: PricingRule[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  variants: ProductVariant[];
}

export type ProductQueryParams = ProductsQueryParams;

export interface PaginatedProductsResponse {
  data: Product[];
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
