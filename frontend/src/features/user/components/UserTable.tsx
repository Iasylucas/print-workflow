import { useMemo } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { createUserColumns } from "./userColumns";
import { DataTable } from "@/components/shared/DataTable";
import type { UsersQueryParams, User, meta } from "../types/user.types";

interface UserTableProps {
  data: { data: User[]; meta: meta } | undefined;
  isLoading: boolean;
  queryParams: UsersQueryParams &
    Required<Pick<UsersQueryParams, "sortBy" | "sortOrder" | "limit">>;
  goToPage: (page: number) => void;
  handleSort: (sortBy: UsersQueryParams["sortBy"]) => void;
  handleEdit: (user: User) => void;
  handleDelete: (userId: string) => void;
  handleStatusToggle: (user: User) => void;
}

const COLUMNS_WIDTHS = [
  "w-[25%]",
  "w-[30%]",
  "w-[15%]",
  "w-[15%]",
  "w-[15%]",
  "w-[50px]",
];

export const UserTable = ({
  data,
  isLoading,
  queryParams,
  goToPage,
  handleSort,
  handleEdit,
  handleDelete,
  handleStatusToggle,
}: UserTableProps) => {
  const fallbackData = useMemo(() => [], []);
  const usersList = data?.data ?? fallbackData;
  const totalPages = data?.meta.totalPages || 1;
  const currentPage = queryParams.page || 1;

  const columns = useMemo(
    () =>
      createUserColumns({
        sortBy: queryParams.sortBy,
        sortOrder: queryParams.sortOrder,
        handleSort,
        handleEdit,
        handleDelete,
        handleStatusToggle,
      }),
    [
      queryParams.sortBy,
      queryParams.sortOrder,
      handleSort,
      handleEdit,
      handleDelete,
      handleStatusToggle,
    ],
  );

  const table = useReactTable({
    data: usersList,
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

  // 💡 APPEL FINALE ULTRA-COMPACT ET STANDARD PRO
  return (
    <DataTable
      table={table}
      columnsWidths={COLUMNS_WIDTHS}
      isLoading={isLoading}
      emptyMessage="Aucun utilisateur trouvé"
      currentPage={currentPage}
      totalPages={totalPages}
      limit={queryParams.limit}
      goToPage={goToPage}
    />
  );
};
