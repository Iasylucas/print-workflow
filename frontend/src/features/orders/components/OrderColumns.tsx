// frontend/src/features/orders/components/OrderColumns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Eye, Trash2, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrderStatusBadge } from "./OrderStatusBadge";
import type { Order } from "../types/orders.types";

interface OrderColumnsProps {
  onView: (order: Order) => void;
  onEdit: (order: Order) => void;
  onDelete?: (order: Order) => void;
}

export const createOrderColumns = ({
  onView,
  onEdit,
  onDelete,
}: OrderColumnsProps): ColumnDef<Order>[] => [
  {
    accessorKey: "invoice",
    header: "Facture",
    cell: ({ row }) => {
      const invoice = row.original.invoice;
      const quote = row.original.quote;
      if (invoice) {
        return <span className="text-xs font-mono">{invoice.number}</span>;
      }
      if (quote) {
        return (
          <span className="text-xs font-mono text-muted-foreground">
            {quote.number}
          </span>
        );
      }
      return <span className="text-xs text-muted-foreground">-</span>;
    },
    size: 120,
  },
  {
    accessorKey: "reference",
    header: "Référence",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.reference}</span>
    ),
    size: 120,
  },
  {
    accessorKey: "designation",
    header: "Désignation",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.designation}</div>
        {row.original.label && (
          <div className="text-xs text-muted-foreground">
            Label: {row.original.label}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => {
      const client = row.original.client;
      return `${client.firstName || ""} ${client.lastName}`;
    },
  },
  {
    accessorKey: "product",
    header: "Produit",
    cell: ({ row }) => row.original.product?.name || "-",
  },
  {
    accessorKey: "quantity",
    header: "Qté",
    cell: ({ row }) => row.original.quantity,
  },
  {
    accessorKey: "unitPrice",
    header: "Prix unit.",
    cell: ({ row }) => `${row.original.unitPrice.toLocaleString()} Ar`,
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "createdAt",
    header: "Créé le",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onView(order)}>
              <Eye className="mr-2 h-4 w-4" />
              Détail
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(order)}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            {order.invoiceId && (
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                Voir facture
              </DropdownMenuItem>
            )}
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDelete(order)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
