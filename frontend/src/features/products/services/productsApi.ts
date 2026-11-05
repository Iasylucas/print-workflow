import { api } from "@/lib/axios";
import { unwrap } from "@/lib/apiUtils";
import type { ApiResponse } from "@/shared/types";
import type {
  Product,
  PaginatedProductsResponse,
  ProductQueryParams,
} from "../types/products.types";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "../schema/products.schema";

export const productsApi = {
  // Liste paginée
  getProducts: (params?: ProductQueryParams) =>
    api
      .get<ApiResponse<PaginatedProductsResponse>>("/products", { params })
      .then(unwrap),

  // Détail d'un produit
  getProductById: (id: number) =>
    api.get<ApiResponse<Product>>(`/products/${id}`).then(unwrap),

  // Création
  createProduct: (data: CreateProductInput) =>
    api.post<ApiResponse<Product>>("/products", data).then(unwrap),

  // Mise à jour
  updateProduct: (id: number, data: UpdateProductInput) =>
    api.put<ApiResponse<Product>>(`/products/${id}`, data).then(unwrap),

  // Suppression
  deleteProduct: (id: number) =>
    api
      .delete<ApiResponse<{ success: boolean }>>(`/products/${id}`)
      .then(unwrap),
};
