// frontend/src/shared/types/product.types.ts
export interface Product {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: number;
  productId: number;
  name: string;
  pricingRules?: {
    id: number;
    pricingMode: string;
    config: Record<string, number>;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiProductResponse {
  data: Product[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
