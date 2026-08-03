import { useMemo } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { createClientColumns } from "./clientColumns";
import { DataTable } from "@/components/shared/DataTable";
import type { ClientsQueryParams, Client } from "../types/client.types";

interface ClientTableProps {
  data: { data: Client[]; meta: any } | undefined;
  isLoading: boolean;
  queryParams: ClientsQueryParams &
    Required<Pick<ClientsQueryParams, "sortBy" | "sortOrder" | "limit">>;
  goToPage: (page: number) => void;
  handleSort: (sortBy: ClientsQueryParams["sortBy"]) => void;
  handleEdit: (client: Client) => void;
  handleDelete: (clientId: string) => void;
}

const COLUMNS_WIDTHS = [
  "w-[5%]",
  "w-[20%]",
  "w-[20%]",
  "w-[15%]",
  "w-[20%]",
  "w-[15%]",
  "w-[50px]",
];

export const ClientTable = ({
  data,
  isLoading,
  queryParams,
  goToPage,
  handleSort,
  handleEdit,
  handleDelete,
}: ClientTableProps) => {
  const fallbackData = useMemo(() => [], []);
  const clientsList = data?.data ?? fallbackData;
  const totalPages = data?.meta.totalPages || 1;
  const currentPage = queryParams.page || 1;

  const columns = useMemo(
    () =>
      createClientColumns({
        handleEdit,
        handleDelete,
      }),
    [handleEdit, handleDelete],
  );

  const table = useReactTable({
    data: clientsList,
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
      emptyMessage="Aucun client trouvé"
      currentPage={currentPage}
      totalPages={totalPages}
      limit={queryParams.limit}
      goToPage={goToPage}
    />
  );
};
