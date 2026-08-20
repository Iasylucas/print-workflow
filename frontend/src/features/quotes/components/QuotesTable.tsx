import { useMemo } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { createQuoteColumns } from "./QuoteColumns";
import { DataTable } from "@/components/shared/DataTable";
import type { QuotesQueryParams, Quote } from "../types/quotes.types";
import type { meta } from "@/features/user/types/user.types";

interface QuotesTableProps {
  data: { data: Quote[]; meta: meta } | undefined;
  isLoading: boolean;
  queryParams: QuotesQueryParams &
    Required<Pick<QuotesQueryParams, "sortBy" | "sortOrder" | "limit">>;
  goToPage: (page: number) => void;
  handleSort: (sortBy: QuotesQueryParams["sortBy"]) => void;
  onView: (quote: Quote) => void;
  onConvert: (quote: Quote) => void;
  onDelete: (quote: Quote) => void;
  onRestore?: (quote: Quote) => void;
  onRowClick?: (row: Quote) => void;
  onDownloadPDF: (quote: Quote) => void;
}

const COLUMNS_WIDTHS = [
  "w-[15%]",
  "w-[20%]",
  "w-[15%]",
  "w-[15%]",
  "w-[15%]",
  "w-[50px]",
];

export const QuotesTable = ({
  data,
  isLoading,
  queryParams,
  goToPage,
  onView,
  onConvert,
  onDelete,
  onRowClick,
  onDownloadPDF,
}: QuotesTableProps) => {
  const fallbackData = useMemo(() => [], []);
  const quotesList = data?.data ?? fallbackData;
  const totalPages = data?.meta.totalPages || 1;
  const currentPage = queryParams.page || 1;

  const columns = useMemo(
    () =>
      createQuoteColumns({
        onView,
        onConvert,
        onDelete,
        onDownloadPDF,
      }),
    [onView, onConvert, onDelete, onDownloadPDF],
  );

  const table = useReactTable({
    data: quotesList,
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
      emptyMessage="Aucun devis trouvé"
      currentPage={currentPage}
      totalPages={totalPages}
      limit={queryParams.limit}
      goToPage={goToPage}
      onRowClick={onRowClick}
    />
  );
};
