// frontend/src/features/invoices/components/InvoicesTable.tsx
import { useMemo } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { createInvoiceColumns } from "./InvoiceColumns";
import { DataTable } from "@/components/shared/DataTable";
import type { InvoicesQueryParams, Invoice } from "../types/invoices.types";
import type { meta } from "@/features/user/types/user.types";

interface InvoicesTableProps {
  data: { data: Invoice[]; meta: meta } | undefined;
  isLoading: boolean;
  queryParams: InvoicesQueryParams &
    Required<Pick<InvoicesQueryParams, "sortBy" | "sortOrder" | "limit">>;
  goToPage: (page: number) => void;
  handleSort: (sortBy: InvoicesQueryParams["sortBy"]) => void;
  onView: (invoice: Invoice) => void;
  onEdit: (invoice: Invoice) => void;
  onDeliver: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
  onAddPayment: (invoice: Invoice) => void;
  onRowClick?: (row: Invoice) => void;
}

const COLUMNS_WIDTHS = [
  "w-[10%]", // Numéro
  "w-[15%]", // Client
  "w-[10%]", // Total
  "w-[10%]", // Acompte
  "w-[10%]", // Reste
  "w-[12%]", // Statut
  "w-[8%]", // Livrée
  "w-[10%]", // Créé le
  "w-[50px]", // Actions
];

export const InvoicesTable = ({
  data,
  isLoading,
  queryParams,
  goToPage,
  // handleSort,
  onView,
  onEdit,
  onDeliver,
  onDelete,
  onAddPayment,
  onRowClick,
}: InvoicesTableProps) => {
  const fallbackData = useMemo(() => [], []);
  const invoicesList = data?.data ?? fallbackData;
  const totalPages = data?.meta.totalPages || 1;
  const currentPage = queryParams.page || 1;

  const columns = useMemo(
    () =>
      createInvoiceColumns({
        onView,
        onEdit,
        onDeliver,
        onDelete,
        onAddPayment,
      }),
    [onView, onEdit, onDeliver, onDelete, onAddPayment],
  );

  const table = useReactTable({
    data: invoicesList,
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
      emptyMessage="Aucune facture trouvée"
      currentPage={currentPage}
      totalPages={totalPages}
      limit={queryParams.limit}
      goToPage={goToPage}
      onRowClick={onRowClick}
    />
  );
};
