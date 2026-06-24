import { useMemo } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { createInvitationColumns } from "./InvitationColumns";
import type { Invitation, InvitationsQueryParams } from "../types/user.types";
import { DataTable } from "@/components/shared/DataTable";

interface Meta {
  totalPages: number;
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

interface InvitationTableProps {
  data: { data: Invitation[]; meta: Meta } | undefined;
  isLoading: boolean;
  queryParams: InvitationsQueryParams &
    Required<Pick<InvitationsQueryParams, "sortBy" | "sortOrder" | "limit">>;
  goToPage: (page: number) => void;
  handleSort: (sortBy: InvitationsQueryParams["sortBy"]) => void;
  handleDeleteInvitation: (id: string) => void;
}

const COLUMNS_WIDTHS = ["w-[35%]", "w-[15%]", "w-[15%]", "w-[30%]", "w-[50px]"];

export const InvitationTable = ({
  data,
  isLoading,
  queryParams,
  goToPage,
  handleSort,
  handleDeleteInvitation,
}: InvitationTableProps) => {
  const fallbackData = useMemo(() => [], []);
  const invitationsList = data?.data ?? fallbackData;
  const totalPages = data?.meta.totalPages || 1;
  const currentPage = queryParams.page || 1;

  const columns = useMemo(
    () =>
      createInvitationColumns({
        sortBy: queryParams.sortBy,
        sortOrder: queryParams.sortOrder,
        handleSort,
        handleDeleteInvitation,
      }),
    [
      queryParams.sortBy,
      queryParams.sortOrder,
      handleSort,
      handleDeleteInvitation,
    ],
  );

  const table = useReactTable({
    data: invitationsList,
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
      emptyMessage="Aucune invitation en attente"
      currentPage={currentPage}
      totalPages={totalPages}
      limit={queryParams.limit}
      goToPage={goToPage}
    />
  );
};
