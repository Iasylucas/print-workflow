// frontend/src/features/products/pages/ProductsPage.tsx
import { useState } from "react";
import { useProducts, useProductMutations } from "../hooks/useProducts";
import { ProductFilters } from "../components/ProductFilters";
import { ProductTable } from "../components/ProductTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { TableStatusBar } from "@/components/shared/TableStatusBar";
import { FailedTable } from "@/components/shared/FailedTable";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import type { Product, ProductQueryParams } from "../types/products.types";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import { ProductFormModal } from "../components/ProductFormModal";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface ConfirmActionState {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  isDestructive?: boolean;
}

export const ProductsPage = () => {
  const { user } = useAuth();
  const [queryParams, setQueryParams] = useState<ProductQueryParams>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
    search: undefined,
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formModalOpen, setFormModalOpen] = useState(false);

  const [confirmAction, setConfirmAction] = useState<ConfirmActionState>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const { data, isLoading, isError, refetch } = useProducts(queryParams);
  const { deleteProductMutation } = useProductMutations();

  const handleFilter = (filters: Partial<ProductQueryParams>) => {
    setQueryParams((prev) => ({ ...prev, ...filters, page: 1 }));
  };

  const goToPage = (page: number) => {
    setQueryParams((prev) => ({ ...prev, page }));
  };

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    // Optionnel : ouvrir un drawer ou modal de détail
    console.log("View product:", product);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormModalOpen(true);
  };

  const handleDelete = (product: Product) => {
    setConfirmAction({
      isOpen: true,
      title: "Supprimer le produit",
      description: `Voulez-vous vraiment supprimer le produit "${product.name}" ? Cette action est irréversible.`,
      isDestructive: true,
      onConfirm: () => {
        deleteProductMutation.mutate(product.id);
        setConfirmAction((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  if (isError) {
    return <FailedTable refetch={refetch} sujet="produits" />;
  }

  const showAddButton = true;

  if (user?.role !== "ADMIN") {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Produits"
        subtitle="Gérez votre catalogue de produits, leurs variantes et leurs grilles de prix."
      >
        {showAddButton && (
          <Button
            onClick={() => {
              setSelectedProduct(null);
              setFormModalOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter un produit
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Rafraîchir
        </Button>
      </PageHeader>

      <div className="space-y-4">
        <ProductFilters filters={queryParams} onFilterChange={handleFilter} />

        <TableStatusBar
          totalCount={data?.meta.total || 0}
          limit={queryParams.limit}
          isLoading={isLoading}
          onLimitChange={(val) => {
            setQueryParams((prev) => ({
              ...prev,
              limit: Number(val),
              page: 1,
            }));
          }}
        />

        <ProductTable
          data={data}
          isLoading={isLoading}
          queryParams={queryParams}
          goToPage={goToPage}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <ProductFormModal
        isOpen={formModalOpen}
        onOpenChange={setFormModalOpen}
        product={selectedProduct}
      />

      {/* Confirmation Dialog */}
      <AlertDialog
        open={confirmAction.isOpen}
        onOpenChange={(open) =>
          setConfirmAction((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <ConfirmationDialog
          state={confirmAction}
          onOpenChange={(open) =>
            setConfirmAction((prev) => ({ ...prev, isOpen: open }))
          }
        />
      </AlertDialog>
    </div>
  );
};
