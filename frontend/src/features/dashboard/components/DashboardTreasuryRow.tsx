import { Wallet, Banknote } from "lucide-react";
import { KpiCard } from "@/components/shared/KpiCard";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { PaymentsTrendChart } from "./PaymentsTrendChart";
import { useInvoiceStats } from "@/features/invoices/hooks/useInvoices";
import { useQuoteStats } from "@/features/quotes/hooks/useQuotes";

const formatAr = (value: number): string =>
  `${value.toLocaleString("fr-FR")} Ar`;

export const DashboardTreasuryRow = () => {
  const { data: dashStats, isLoading: dashLoading } = useDashboardStats();
  const { data: invoiceStats, isLoading: invoiceLoading } = useInvoiceStats();
  const { data: quoteStats, isLoading: quoteLoading } = useQuoteStats();

  const delta = dashStats?.paymentsDeltaPercent;

  return (
    <section>
      <h2 className="text-sm font-semibold text-muted-foreground mb-3">
        Trésorerie
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <PaymentsTrendChart />
        </div>
        <div className="flex flex-col gap-4">
          <KpiCard
            label="Encaissements du mois"
            value={formatAr(dashStats?.paymentsThisMonth ?? 0)}
            icon={Banknote}
            isLoading={dashLoading}
            description={
              delta === undefined
                ? undefined
                : delta === null
                  ? "Pas de comparaison disponible"
                  : `${delta >= 0 ? "+" : ""}${delta} % vs mois dernier`
            }
          />
          <KpiCard
            label="Reste à encaisser"
            value={formatAr(invoiceStats?.remainingToCollect ?? 0)}
            icon={Wallet}
            isLoading={invoiceLoading}
            description="Sur factures impayées et partielles"
          />
          <KpiCard
            label="Pipeline devis"
            value={formatAr(quoteStats?.pendingAmount ?? 0)}
            icon={Banknote}
            isLoading={quoteLoading}
            description={`${quoteStats?.pending ?? 0} devis en attente`}
          />
        </div>
      </div>
    </section>
  );
};
