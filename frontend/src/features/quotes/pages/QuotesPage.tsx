import { useState } from "react";
import { useQuotes, useQuoteMutations } from "../hooks/useQuotes";
import { QuoteFilters } from "../components/QuoteFilters";
import { QuotesTable } from "../components/QuotesTable";
import { QuoteDetailDrawer } from "../components/QuoteDetailDrawer";
import { PageHeader } from "@/components/shared/PageHeader";
import { TableStatusBar } from "@/components/shared/TableStatusBar";
import { FailedTable } from "@/components/shared/FailedTable";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import type { QuotesQueryParams, Quote } from "../types/quotes.types";
import { useNavigate } from "react-router-dom";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import { downloadQuotePDF } from "@/shared/pdf/QuotePdf";
import { toast } from "sonner";
import { quotesApi } from "../services/quotesApi";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface ConfirmActionState {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  isDestructive?: boolean;
}

export const QuotesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [queryParams, setQueryParams] = useState<QuotesQueryParams>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
    search: undefined,
    status: undefined,
    clientId: undefined,
    startDate: undefined,
    endDate: undefined,
  });

  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);

  const [confirmAction, setConfirmAction] = useState<ConfirmActionState>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const { data, isLoading, isError, refetch } = useQuotes(queryParams);
  const {
    deleteQuoteMutation,
    restoreQuoteMutation,
    convertToInvoiceMutation,
  } = useQuoteMutations();

  const handleFilter = (filters: Partial<QuotesQueryParams>) => {
    setQueryParams((prev) => ({ ...prev, ...filters, page: 1 }));
  };

  const handleSort = (sortBy: QuotesQueryParams["sortBy"]) => {
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

  const handleView = (quote: Quote) => {
    setSelectedQuote(quote);
    setDetailDrawerOpen(true);
  };

  const handleEdit = (quote: Quote) => {
    console.log("Edit quote:", quote);
  };

  const handleConvert = (quote: Quote) => {
    setConfirmAction({
      isOpen: true,
      title: "Convertir en facture",
      description: `Voulez-vous convertir le devis ${quote.number} en facture ?`,
      isDestructive: false,
      onConfirm: () => {
        convertToInvoiceMutation.mutate(quote.id, {
          onSuccess: (data) => {
            if (data?.invoice?.id) {
              navigate(`/pos/${data.invoice.id}`);
            }
            setConfirmAction((prev) => ({ ...prev, isOpen: false }));
          },
        });
      },
    });
  };

  const handleDelete = (quote: Quote) => {
    setConfirmAction({
      isOpen: true,
      title: "Supprimer le devis ?",
      description: `Voulez-vous vraiment supprimer le devis ${quote.number} ? Cette action est irréversible.`,
      isDestructive: true,
      onConfirm: () => {
        deleteQuoteMutation.mutate(quote.id);
        setConfirmAction((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleRestore = (quote: Quote) => {
    if (window.confirm(`Restaurer le devis ${quote.number} ?`)) {
      restoreQuoteMutation.mutate(quote.id);
    }
  };

  const handleDownloadPDF = async (quote: Quote) => {
    try {
      const detail = await quotesApi.getQuoteById(quote.id);
      await downloadQuotePDF(detail, detail.companyInfo);
    } catch {
      toast.error("Erreur lors de la génération du PDF");
    }
  };

  if (isError) {
    return <FailedTable refetch={refetch} sujet="devis" />;
  }

  if (user?.role !== "ADMIN" && user?.role !== "SALES") {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Devis"
        subtitle="Gérez tous vos devis, suivez leur état et convertissez-les en factures."
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
        <QuoteFilters filters={queryParams} onFilterChange={handleFilter} />

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

        <QuotesTable
          data={data}
          isLoading={isLoading}
          queryParams={queryParams}
          goToPage={goToPage}
          handleSort={handleSort}
          onView={handleView}
          onEdit={handleEdit}
          onConvert={handleConvert}
          onDelete={handleDelete}
          onRestore={handleRestore}
          onRowClick={(row) => {
            const target = window.event?.target as HTMLElement;
            if (target?.closest('button, [role="menuitem"], [role="menu"]')) {
              return;
            }
            handleView(row);
          }}
          onDownloadPDF={handleDownloadPDF}
        />
      </div>

      <QuoteDetailDrawer
        isOpen={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        quoteId={selectedQuote?.id || null}
        onConvert={() => {
          if (selectedQuote) {
            handleConvert(selectedQuote);
          }
        }}
      />

      <AlertDialog
        open={confirmAction.isOpen}
        onOpenChange={(open) =>
          setConfirmAction((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <ConfirmationDialog
          state={confirmAction}
          onOpenChange={(open) =>
            setConfirmAction((prev) => ({ ...prev, isOpen: open }))
          }
        />
      </AlertDialog>
    </div>
  );
};
