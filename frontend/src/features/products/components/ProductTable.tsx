import { useMemo } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { createProductColumns } from "./ProductColumns";
import { DataTable } from "@/components/shared/DataTable";
import type { Product, ProductQueryParams } from "../types/products.types";
import type { meta } from "@/features/user/types/user.types";

interface ProductTableProps {
  data: { data: Product[]; meta: meta } | undefined;
  isLoading: boolean;
  queryParams: ProductQueryParams &
    Required<Pick<ProductQueryParams, "sortBy" | "sortOrder" | "limit">>;
  goToPage: (page: number) => void;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onRowClick?: (row: Product) => void;
}

const COLUMNS_WIDTHS = ["w-[20%]", "w-[20%]", "w-[35%]", "w-[15%]", "w-[50px]"];

export const ProductTable = ({
  data,
  isLoading,
  queryParams,
  goToPage,
  onEdit,
}: ProductTableProps) => {
  const fallbackData = useMemo(() => [], []);
  const productsList = data?.data ?? fallbackData;
  const totalPages = data?.meta.totalPages || 1;
  const currentPage = queryParams.page || 1;

  const columns = useMemo(() => createProductColumns(), []);

  const table = useReactTable({
    data: productsList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting: [
        { id: queryParams.sortBy, desc: queryParams.sortOrder === "desc" },
      ],
      pagination: { pageIndex: currentPage - 1, pageSize: queryParams.limit },
    },
    manualSorting: true,
    manualPagination: true,
  });

  return (
    <DataTable
      table={table}
      columnsWidths={COLUMNS_WIDTHS}
      isLoading={isLoading}
      emptyMessage="Aucun produit trouvé"
      currentPage={currentPage}
      totalPages={totalPages}
      limit={queryParams.limit}
      goToPage={goToPage}
      onRowClick={(row) => {
        onEdit(row);
      }}
    />
  );
};
