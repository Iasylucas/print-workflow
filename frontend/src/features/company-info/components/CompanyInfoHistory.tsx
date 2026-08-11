// frontend/src/features/company-info/components/CompanyInfoHistory.tsx
import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
} from "@tanstack/react-table";
import { DataTable } from "@/components/shared/DataTable";
import type { CompanyInfo } from "../types/company.types";
import type { meta } from "@/features/user/types/user.types";

interface CompanyInfoHistoryProps {
  data: { data: CompanyInfo[]; meta: meta } | undefined;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  limit: number;
  goToPage: (page: number) => void;
  onRowClick: (version: CompanyInfo) => void;
}

const COLUMNS_WIDTHS = [
  "w-[15%]", // Date
  "w-[15%]", // Nom
  "w-[10%]", // NIF
  "w-[20%]", // Adresse
  "w-[12%]", // Téléphone
  "w-[15%]", // Email
  "w-[13%]", // Statut
];

export const CompanyInfoHistory = ({
  data,
  isLoading,
  currentPage,
  totalPages,
  limit,
  goToPage,
  onRowClick,
}: CompanyInfoHistoryProps) => {
  const historyList = data?.data || [];
  const fallbackData = useMemo(() => [], []);

  const columns = useMemo<ColumnDef<CompanyInfo>[]>(
    () => [
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => (
          <span className="text-sm whitespace-nowrap">
            {new Date(row.original.createdAt).toLocaleDateString("fr-FR")}
          </span>
        ),
      },
      {
        accessorKey: "name",
        header: "Nom",
        cell: ({ row }) => (
          <span className="text-sm font-medium">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "nif",
        header: "NIF",
        cell: ({ row }) => (
          <span className="text-sm font-mono">{row.original.nif}</span>
        ),
      },
      {
        accessorKey: "mainAddress",
        header: "Adresse",
        cell: ({ row }) => (
          <span className="text-sm truncate block max-w-[150px]">
            {row.original.mainAddress}
          </span>
        ),
      },
      {
        accessorKey: "standardPhone",
        header: "Téléphone",
        cell: ({ row }) => (
          <span className="text-sm">{row.original.standardPhone || "-"}</span>
        ),
      },
      {
        accessorKey: "contactEmail",
        header: "Email",
        cell: ({ row }) => (
          <span className="text-sm truncate block max-w-[120px]">
            {row.original.contactEmail || "-"}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Version",
        cell: ({ row }) => {
          const isActive = row.original.id === data?.data?.[0]?.id;
          return (
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted/50">
              {isActive ? (
                <span className="text-emerald-600 font-medium">Active</span>
              ) : (
                <span className="text-muted-foreground">Archivée</span>
              )}
            </span>
          );
        },
      },
    ],
    [data],
  );

  const table = useReactTable({
    data: historyList || fallbackData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    state: {
      pagination: { pageIndex: currentPage - 1, pageSize: limit },
    },
  });

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">
        Historique des modifications
      </h3>
      <DataTable
        table={table}
        columnsWidths={COLUMNS_WIDTHS}
        isLoading={isLoading}
        emptyMessage="Aucun historique trouvé"
        currentPage={currentPage}
        totalPages={totalPages}
        limit={limit}
        goToPage={goToPage}
        onRowClick={onRowClick}
      />
    </div>
  );
};
