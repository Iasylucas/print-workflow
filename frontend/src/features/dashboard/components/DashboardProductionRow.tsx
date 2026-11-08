import { Printer, PackageCheck, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { KpiCard } from "@/components/shared/KpiCard";
import { ProductionByStatusChart } from "./ProductionByStatusChart";
import { useOrderStats } from "@/features/orders/hooks/useOrders";
import { useInvoiceStats } from "@/features/invoices/hooks/useInvoices";

export const DashboardProductionRow = () => {
  const { data: orderStats, isLoading: orderLoading } = useOrderStats();
  const { data: invoiceStats, isLoading: invoiceLoading } = useInvoiceStats();

  const isLoading = orderLoading || invoiceLoading;

  return (
    <section>
      <h2 className="text-sm font-semibold text-muted-foreground mb-3">
        Production
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        <div className="lg:col-span-2 flex">
          <ProductionByStatusChart />
        </div>
        <div className="flex flex-col gap-4">
          <Link to="/orders?status=printing_in_progress">
            <KpiCard
              label="En production"
              value={orderStats?.inProduction ?? 0}
              icon={Printer}
              isLoading={isLoading}
              description="Impression et découpe"
            />
          </Link>
          <Link to="/orders?status=ready_for_delivery">
            <KpiCard
              label="Prêt pour livraison"
              value={orderStats?.readyForDelivery ?? 0}
              icon={PackageCheck}
              variant="success"
              isLoading={isLoading}
              description="En attente d'action commerciale"
            />
          </Link>
          <Link to="/invoices?isDelivered=false">
            <KpiCard
              label="À livrer"
              value={invoiceStats?.toDeliver ?? 0}
              icon={Truck}
              isLoading={isLoading}
              description="Factures non livrées"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};
