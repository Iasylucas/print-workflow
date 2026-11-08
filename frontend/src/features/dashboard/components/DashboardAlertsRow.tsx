import { Clock, AlertCircle, Trash2, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { KpiCard } from "@/components/shared/KpiCard";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useQuoteStats } from "@/features/quotes/hooks/useQuotes";
import { useInvoiceStats } from "@/features/invoices/hooks/useInvoices";
import { useOrderStats } from "@/features/orders/hooks/useOrders";

export const DashboardAlertsRow = () => {
  const { data: orderStats, isLoading: orderLoading } = useOrderStats();
  const { data: invoiceStats, isLoading: invoiceLoading } = useInvoiceStats();
  const { data: quoteStats, isLoading: quoteLoading } = useQuoteStats();
  const { data: dashStats, isLoading: dashLoading } = useDashboardStats();

  const isLoading =
    orderLoading || invoiceLoading || quoteLoading || dashLoading;

  return (
    <section>
      <h2 className="text-sm font-semibold text-muted-foreground mb-3">
        Alertes
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/orders?status=waiting_for_file">
          <KpiCard
            label="En attente fichier"
            value={orderStats?.waitingForFile ?? 0}
            icon={Clock}
            variant="warning"
            isLoading={isLoading}
            description="Commandes bloquées côté client"
          />
        </Link>
        <Link to="/invoices?status=unpaid">
          <KpiCard
            label="Factures impayées"
            value={invoiceStats?.unpaid ?? 0}
            icon={AlertCircle}
            variant="destructive"
            isLoading={isLoading}
            description="Relance nécessaire"
          />
        </Link>
        <Link to="/quotes?status=pending">
          <KpiCard
            label="Devis en attente"
            value={quoteStats?.pending ?? 0}
            icon={FileText}
            isLoading={isLoading}
            description="À convertir en facture"
          />
        </Link>
        <Link to="/payment-audit-logs?action=DELETE">
          <KpiCard
            label="Paiements supprimés"
            value={dashStats?.deletedPaymentsThisMonth ?? 0}
            icon={Trash2}
            variant="warning"
            isLoading={isLoading}
            description="Ce mois"
          />
        </Link>
      </div>
    </section>
  );
};
