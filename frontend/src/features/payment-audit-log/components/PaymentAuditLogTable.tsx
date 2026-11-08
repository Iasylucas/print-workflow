import { useMemo } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/DataTable";
import { paymentAuditLogColumns } from "./PaymentAuditLogColumns";
import type {
  PaymentAuditLog,
  PaymentAuditLogQueryParams,
} from "../types/payment-audit-log.types";

interface PaymentAuditLogTableProps {
  data: { data: PaymentAuditLog[]; meta: any } | undefined;
  isLoading: boolean;
  queryParams: PaymentAuditLogQueryParams;
  goToPage: (page: number) => void;
  onRowClick: (log: PaymentAuditLog) => void;
}

const COLUMNS_WIDTHS = [
  "w-[18%]", // Date
  "w-[15%]", // Utilisateur
  "w-[12%]", // Action
  "w-[10%]", // Paiement
  "w-[12%]", // Montant
  "w-[18%]", // Raison
];

export const PaymentAuditLogTable = ({
  data,
  isLoading,
  queryParams,
  goToPage,
  onRowClick,
}: PaymentAuditLogTableProps) => {
  const logs = data?.data || [];
  const fallbackData = useMemo(() => [], []);
  const totalPages = data?.meta.totalPages || 1;
  const currentPage = queryParams.page || 1;

  const table = useReactTable({
    data: logs || fallbackData,
    columns: paymentAuditLogColumns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    state: {
      pagination: { pageIndex: currentPage - 1, pageSize: queryParams.limit },
    },
  });

  return (
    <DataTable
      table={table}
      columnsWidths={COLUMNS_WIDTHS}
      isLoading={isLoading}
      emptyMessage="Aucun historique trouvé"
      currentPage={currentPage}
      totalPages={totalPages}
      limit={queryParams.limit}
      goToPage={goToPage}
      onRowClick={onRowClick}
    />
  );
};