// frontend/src/features/orders/components/OrdersTable.tsx
import { useMemo } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { createOrderColumns } from "./OrderColumns";
import { DataTable } from "@/components/shared/DataTable";
import type { OrdersQueryParams, OrderDetail } from "../types/orders.types";
import type { meta } from "@/features/user/types/user.types";

interface OrdersTableProps {
  data: { data: OrderDetail[]; meta: meta } | undefined;
  isLoading: boolean;
  queryParams: OrdersQueryParams &
    Required<Pick<OrdersQueryParams, "sortBy" | "sortOrder" | "limit">>;
  goToPage: (page: number) => void;
  handleSort: (sortBy: OrdersQueryParams["sortBy"]) => void;
  onRowClick?: (row: OrderDetail) => void;
}

const COLUMNS_WIDTHS = [
  "w-[10%]", // Facture
  "w-[12%]", // Référence
  "w-[18%]", // Désignation
  "w-[12%]", // Client
  "w-[10%]", // Produit
  "w-[6%]", // Qté
  "w-[10%]", // Prix unit.
  "w-[12%]", // Statut
  "w-[10%]", // Créé le
  "w-[50px]", // Actions
];

export const OrdersTable = ({
  data,
  isLoading,
  queryParams,
  goToPage,
  // handleSort,
  onRowClick,
}: OrdersTableProps) => {
  const fallbackData = useMemo(() => [], []);
  const ordersList = data?.data ?? fallbackData;
  const totalPages = data?.meta.totalPages || 1;
  const currentPage = queryParams.page || 1;

  const columns = useMemo(() => createOrderColumns(), []);

  const table = useReactTable({
    data: ordersList,
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
      emptyMessage="Aucune commande trouvée"
      currentPage={currentPage}
      totalPages={totalPages}
      limit={queryParams.limit}
      goToPage={goToPage}
      onRowClick={onRowClick}
    />
  );
};
