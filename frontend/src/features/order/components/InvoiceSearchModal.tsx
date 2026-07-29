import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { useInvoices } from "@/features/invoices/hooks/useInvoices";
import { DataTable } from "@/components/shared/DataTable";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { createInvoiceColumns } from "@/features/invoices/components/InvoiceColumns";
import type { Invoice } from "@/features/invoices/types/invoices.types";

interface InvoiceSearchModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectInvoice: (invoice: Invoice) => void;
}

export const InvoiceSearchModal = ({
  isOpen,
  onOpenChange,
  onSelectInvoice,
}: InvoiceSearchModalProps) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useInvoices({
    page,
    limit,
    search: search || undefined,
    isDelivered: false,
  });

  const invoices = data?.data || [];
  const totalPages = data?.meta.totalPages || 1;
  const currentPage = data?.meta.page || 1;

  const handleView = (invoice: Invoice) => {
    onSelectInvoice(invoice);
    onOpenChange(false);
  };

  // Colonnes simplifiées pour le modal
  const columns = createInvoiceColumns({
    onView: handleView,
    onEdit: () => {},
    onDeliver: () => {},
    onDelete: () => {},
    onAddPayment: () => {},
  });

  // On adapte les colonnes : on enlève la colonne actions
  const modalColumns = columns.filter((col) => col.id !== "actions");

  const table = useReactTable({
    data: invoices,
    columns: modalColumns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    state: {
      pagination: { pageIndex: currentPage - 1, pageSize: limit },
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[70vw] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Charger une facture</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Barre de recherche */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par numéro ou client..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 h-9 text-xs"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(1)}
              className="h-9"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Tableau */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <DataTable
                table={table}
                columnsWidths={[
                  "w-[15%]",
                  "w-[20%]",
                  "w-[15%]",
                  "w-[15%]",
                  "w-[15%]",
                  "w-[10%]",
                ]}
                isLoading={isLoading}
                emptyMessage="Aucune facture trouvée"
                currentPage={currentPage}
                totalPages={totalPages}
                limit={limit}
                goToPage={setPage}
                onRowClick={(row) => handleView(row.original)}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
