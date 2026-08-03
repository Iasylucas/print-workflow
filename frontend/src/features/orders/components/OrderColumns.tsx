import type { ColumnDef } from "@tanstack/react-table";
import { OrderStatusBadge } from "./OrderStatusBadge";
import type { OrderDetail } from "../types/orders.types";

export const createOrderColumns = (): ColumnDef<OrderDetail>[] => [
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
];
