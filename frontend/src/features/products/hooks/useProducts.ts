import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { productsApi } from "../services/productsApi";
import type {
  //   Product,
  ProductQueryParams,
  //   PaginatedProductsResponse,
} from "../types/products.types";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "../schema/products.schema";

const PRODUCTS_QUERY_KEY = "products";

// ============================================================
// HOOK POUR LA LISTE
// ============================================================
export const useProducts = (params: ProductQueryParams) => {
  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, params],
    queryFn: () => productsApi.getProducts(params),
    staleTime: 1000 * 60 * 2,
  });
};

// ============================================================
// HOOK POUR LE DÉTAIL
// ============================================================
export const useProductDetail = (id: number | null) => {
  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, "detail", id],
    queryFn: () => productsApi.getProductById(id!),
    enabled: !!id,
    staleTime: 0,
  });
};

// ============================================================
// HOOK POUR LES MUTATIONS
// ============================================================
export const useProductMutations = () => {
  const queryClient = useQueryClient();

  const invalidateProducts = () => {
    queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
  };

  const createProductMutation = useMutation({
    mutationFn: (data: CreateProductInput) => productsApi.createProduct(data),
    onSuccess: () => {
      toast.success("Produit créé avec succès");
      invalidateProducts();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de la création du produit");
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductInput }) =>
      productsApi.updateProduct(id, data),
    onSuccess: (_, { id }) => {
      toast.success("Produit mis à jour avec succès");
      invalidateProducts();
      queryClient.invalidateQueries({
        queryKey: [PRODUCTS_QUERY_KEY, "detail", id],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de la mise à jour du produit");
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => productsApi.deleteProduct(id),
    onSuccess: () => {
      toast.success("Produit supprimé avec succès");
      invalidateProducts();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Échec de la suppression du produit");
    },
  });

  return {
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
  };
};
