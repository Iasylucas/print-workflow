import { TableRow, TableCell } from "@/components/ui/table";

interface EmptyStateProps {
  message: string;
  description?: string;
  colSpan: number;
}

export const EmptyState = ({
  message,
  description,
  colSpan,
}: EmptyStateProps) => {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell
        colSpan={colSpan}
        className="text-center py-16 text-muted-foreground animate-in fade-in duration-300"
      >
        <p className="text-sm font-medium font-sans text-foreground">
          {message}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground/70 mt-1.5 font-sans max-w-sm mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </TableCell>
    </TableRow>
  );
};
