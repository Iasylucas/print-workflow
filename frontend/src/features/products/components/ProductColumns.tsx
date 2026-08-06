// frontend/src/features/products/components/ProductColumns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { Product } from "../types/products.types";

export const createProductColumns = (): ColumnDef<Product>[] => [
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground font-mono">
        {row.original.slug}
      </span>
    ),
  },
  {
    accessorKey: "variants",
    header: "Variantes",
    cell: ({ row }) => {
      const variants = row.original.variants || [];
      return (
        <div className="flex flex-wrap gap-1">
          {variants.map((v) => (
            <Badge key={v.id} variant="secondary" className="text-[10px]">
              {v.name}
            </Badge>
          ))}
          {variants.length === 0 && (
            <span className="text-xs text-muted-foreground">-</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Créé le",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {new Date(row.original.createdAt).toLocaleDateString("fr-FR")}
      </span>
    ),
  },
];
