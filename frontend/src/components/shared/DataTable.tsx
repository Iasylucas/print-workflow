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
  PaginationEllipsis,
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
  onRowClick?: (row: TData) => void;
}

// Pages à afficher : tout si <= 7, sinon 1 … courante±1 … dernière
const getPageItems = (
  current: number,
  total: number,
): (number | "ellipsis")[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [...new Set([1, total, current - 1, current, current + 1])]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const items: (number | "ellipsis")[] = [];
  pages.forEach((page, i) => {
    const prev = pages[i - 1];
    if (prev !== undefined) {
      if (page - prev === 2) items.push(prev + 1);
      else if (page - prev > 2) items.push("ellipsis");
    }
    items.push(page);
  });
  return items;
};

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
    <div className="border rounded-lg overflow-hidden bg-card">
      <Table className="table-fixed w-full">
        {/* EN-TÊTE DU TABLEAU GÉNÉRIQUE */}
        <TableHeader className="bg-muted/40 border-b">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    "h-10 text-xs font-medium text-muted-foreground",
                    columnsWidths[index],
                  )}
                >
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
                onClick={() => onRowClick?.(row.original)}
                className={cn(
                  "transition-colors hover:bg-muted/40",
                  onRowClick && "cursor-pointer",
                )}
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
        <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/40">
          <p className="text-xs text-muted-foreground tabular-nums">
            Page {currentPage} sur {totalPages}
          </p>

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

              {getPageItems(currentPage, totalPages).map((item, index) =>
                item === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item}>
                    <PaginationLink
                      href="#"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault();
                        goToPage(item);
                      }}
                      isActive={currentPage === item}
                      className="cursor-pointer text-xs"
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

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
