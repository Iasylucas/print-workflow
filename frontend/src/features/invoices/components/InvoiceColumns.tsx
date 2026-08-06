import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  FileDown,
  // Receipt,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";
import type { Invoice } from "../types/invoices.types";
import { cn } from "@/lib/utils";

interface InvoiceColumnsProps {
  onView: (invoice: Invoice) => void;
  onEdit: (invoice: Invoice) => void;
  onDeliver: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
  onAddPayment: (invoice: Invoice) => void;
  onDownloadPDF: (invoice: Invoice) => void;
}

export const createInvoiceColumns = ({
  onView,
  onEdit,
  onDeliver,
  onDelete,
  onDownloadPDF,
}: InvoiceColumnsProps): ColumnDef<Invoice>[] => [
  {
    accessorKey: "number",
    header: "Numéro",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-medium">
        {row.original.number}
      </span>
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
    accessorKey: "total",
    header: "Total (Ar)",
    cell: ({ row }) => row.original.total.toLocaleString(),
  },
  {
    accessorKey: "deposit",
    header: "Acompte (Ar)",
  },
  {
    accessorKey: "remaining",
    header: "Reste (Ar)",
    cell: ({ row }) => {
      const remaining = row.original.total - row.original.deposit;
      return remaining;
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Statut",
    cell: ({ row }) => (
      <InvoiceStatusBadge status={row.original.paymentStatus} />
    ),
  },
  {
    accessorKey: "isDelivered",
    header: "Livrée",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn(
          "border-0",
          row.original.isDelivered
            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
            : "bg-muted/50 text-muted-foreground",
        )}
      >
        {row.original.isDelivered ? "Livrée" : "Non livrée"}
      </Badge>
    ),
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
      const invoice = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onView(invoice)}>
              <Eye className="mr-2 h-4 w-4" />
              Détail
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(invoice)}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            {!invoice.isDelivered && (
              <DropdownMenuItem onClick={() => onDeliver(invoice)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Marquer livrée
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onDownloadPDF(invoice)}>
              <FileDown className="mr-2 h-4 w-4" />
              Télécharger PDF
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(invoice)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
