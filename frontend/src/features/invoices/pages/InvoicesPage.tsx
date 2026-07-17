// frontend/src/features/invoices/pages/InvoicesPage.tsx
import { useState } from "react";
import { useInvoices, useInvoiceMutations } from "../hooks/useInvoices";
import { InvoiceFilters } from "../components/InvoiceFilters";
import { InvoicesTable } from "../components/InvoicesTable";
import { InvoiceDetailDrawer } from "../components/InvoiceDetailDrawer";
import { PageHeader } from "@/components/shared/PageHeader";
import { TableStatusBar } from "@/components/shared/TableStatusBar";
import { FailedTable } from "@/components/shared/FailedTable";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import type { InvoicesQueryParams, Invoice } from "../types/invoices.types";
import { AddPaymentModal } from "../components/AddPaymentModal";

export const InvoicesPage = () => {
  const [queryParams, setQueryParams] = useState<InvoicesQueryParams>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
    search: undefined,
    status: undefined,
    clientId: undefined,
    isDelivered: undefined,
    startDate: undefined,
    endDate: undefined,
  });

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useInvoices(queryParams);
  const { deleteInvoiceMutation } = useInvoiceMutations();

  const [addPaymentModalOpen, setAddPaymentModalOpen] = useState(false);
  const { markDeliveredMutation } = useInvoiceMutations();

  const handleAddPayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setAddPaymentModalOpen(true);
  };

  const handleFilter = (filters: Partial<InvoicesQueryParams>) => {
    setQueryParams((prev) => ({ ...prev, ...filters, page: 1 }));
  };

  const handleSort = (sortBy: InvoicesQueryParams["sortBy"]) => {
    setQueryParams((prev) => ({
      ...prev,
      sortBy,
      sortOrder:
        prev.sortBy === sortBy && prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const goToPage = (page: number) => {
    setQueryParams((prev) => ({ ...prev, page }));
  };

  const handleView = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setDetailDrawerOpen(true);
  };

  const handleEdit = (invoice: Invoice) => {
    // À implémenter : modal d'édition de la facture
    console.log("Edit invoice:", invoice);
  };

  const handleDeliver = (invoice: Invoice) => {
    if (window.confirm(`Marquer la facture ${invoice.number} comme livrée ?`)) {
      markDeliveredMutation.mutate({
        id: invoice.id,
        data: { isDelivered: true },
      });
    }
  };

  const handleDelete = (invoice: Invoice) => {
    if (window.confirm(`Supprimer la facture ${invoice.number} ?`)) {
      deleteInvoiceMutation.mutate(invoice.id);
    }
  };

  if (isError) {
    return <FailedTable refetch={refetch} sujet="factures" />;
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Factures"
        subtitle="Gérez toutes les factures, suivez les paiements et l'état de livraison."
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Rafraîchir
        </Button>
      </PageHeader>

      <div className="space-y-4">
        <InvoiceFilters filters={queryParams} onFilterChange={handleFilter} />

        <TableStatusBar
          totalCount={data?.meta.total || 0}
          limit={queryParams.limit}
          isLoading={isLoading}
          onLimitChange={(val) => {
            setQueryParams((prev) => ({
              ...prev,
              limit: Number(val),
              page: 1,
            }));
          }}
        />

        <InvoicesTable
          data={data}
          isLoading={isLoading}
          queryParams={queryParams}
          goToPage={goToPage}
          handleSort={handleSort}
          onView={handleView}
          onEdit={handleEdit}
          onDeliver={handleDeliver}
          onDelete={handleDelete}
          onAddPayment={handleAddPayment}
          onRowClick={(row) => handleView(row.original)}
        />
      </div>

      <InvoiceDetailDrawer
        isOpen={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        invoiceId={selectedInvoice?.id || null}
      />

      <AddPaymentModal
        isOpen={addPaymentModalOpen}
        onOpenChange={setAddPaymentModalOpen}
        invoice={selectedInvoice}
      />
    </div>
  );
};
