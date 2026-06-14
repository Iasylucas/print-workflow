import { TableRow, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface TableSkeletonProps {
  columnsWidth: string[];
  rowCount?: number;
}

export const TableSkeleton = ({
  columnsWidth,
  rowCount = 5,
}: TableSkeletonProps) => {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <TableRow
          key={rowIndex}
          className="hover:bg-transparent border-b last:border-0"
        >
          {columnsWidth.map((widthClass, colIndex) => (
            <TableCell key={colIndex} className="py-3.5 align-middle">
              {colIndex === 0 ? (
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-muted animate-pulse shrink-0" />
                  <div className="h-4 w-24 rounded-md bg-muted animate-pulse" />
                </div>
              ) : colIndex === columnsWidth.length - 1 ? (
                <div className="h-8 w-8 rounded-md bg-muted animate-pulse ml-auto" />
              ) : (
                <div
                  className={cn(
                    "h-4 rounded-md bg-muted animate-pulse",
                    widthClass,
                  )}
                />
              )}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};
