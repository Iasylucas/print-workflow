import type { Table as TanStackTable } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { TableSkeleton } from "./TableSkeleton";
import { EmptyState } from "./EmptyState";
import { cn } from "@/lib/utils";

interface DataTableProps<TData> {
  table: TanStackTable<TData>;
  columnsWidths: string[];
  isLoading: boolean;
  emptyMessage?: string;
  emptyDescription?: string;

  currentPage: number;
  totalPages: number;
  limit: number;
  goToPage: (page: number) => void;
  onRowClick?: (row: any) => void;
}

export const DataTable = <TData,>({
  table,
  columnsWidths,
  isLoading,
  emptyMessage = "Aucune donnée trouvée",
  emptyDescription = "Essayez de modifier vos critères de recherche ou vos filtres.",
  currentPage,
  totalPages,
  limit,
  goToPage,
  onRowClick,
}: DataTableProps<TData>) => {
  const columnsCount = table.getAllColumns().length;
  const rows = table.getRowModel().rows;

  return (
    <div className="border rounded-md overflow-hidden bg-background">
      <Table className="table-layout-fixed w-full">
        {/* EN-TÊTE DU TABLEAU GÉNÉRIQUE */}
        <TableHeader className="bg-muted/40 border-b">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => (
                <TableHead key={header.id} className={columnsWidths[index]}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        {/* CORPS DU TABLEAU GÉNÉRIQUE */}
        <TableBody>
          {isLoading ? (
            <TableSkeleton
              columnsWidth={columnsWidths}
              rowCount={limit > 20 ? 10 : 5}
            />
          ) : rows.length === 0 ? (
            <EmptyState
              message={emptyMessage}
              description={emptyDescription}
              colSpan={columnsCount}
            />
          ) : (
            rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={
                  (cn(
                    onRowClick &&
                      "cursor-pointer hover:bg-muted/50 transition-colors",
                  ),
                  "hover:bg-muted/30 transition-colors")
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-2.5 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* PIED DE TABLEAU GÉNÉRIQUE : Pagination universelle */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end px-4 py-2 border-t bg-muted/40">
          <Pagination className="w-auto mx-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) goToPage(currentPage - 1);
                  }}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-40"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault();
                        goToPage(pageNumber);
                      }}
                      isActive={currentPage === pageNumber}
                      className="cursor-pointer text-xs"
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) goToPage(currentPage + 1);
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-40"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};
