// frontend/src/features/quotes/components/QuoteColumns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Trash2, FileText, FileDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { QuoteStatusBadge } from "./QuoteStatusBadge";
import type { Quote } from "../types/quotes.types";

interface QuoteColumnsProps {
  onView: (quote: Quote) => void;
  onConvert: (quote: Quote) => void;
  onDelete: (quote: Quote) => void;
  onDownloadPDF: (quote: Quote) => void;
}

export const createQuoteColumns = ({
  onView,
  onConvert,
  onDelete,
  onDownloadPDF,
}: QuoteColumnsProps): ColumnDef<Quote>[] => [
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
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => <QuoteStatusBadge status={row.original.status} />,
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
      const quote = row.original;
      const isConverted = quote.status === "converted";

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onView(quote)}>
              <Eye className="mr-2 h-4 w-4" />
              Détail
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDownloadPDF(quote)}>
              <FileDown className="mr-2 h-4 w-4" />
              Télécharger PDF
            </DropdownMenuItem>
            {!isConverted && (
              <DropdownMenuItem onClick={() => onConvert(quote)}>
                <FileText className="mr-2 h-4 w-4" />
                Convertir en facture
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(quote)}
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
