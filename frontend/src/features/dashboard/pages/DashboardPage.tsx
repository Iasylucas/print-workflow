import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { DashboardAlertsRow } from "../components/DashboardAlertsRow";
import { DashboardTreasuryRow } from "../components/DashboardTreasuryRow";
import { DashboardProductionRow } from "../components/DashboardProductionRow";
import { DashboardRecentActivity } from "../components/DashboardRecentActivity";

const formatToday = (): string => {
  const label = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  return label.charAt(0).toUpperCase() + label.slice(1);
};

export const DashboardPage = () => {
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    queryClient.invalidateQueries({ queryKey: ["orders", "stats"] });
    queryClient.invalidateQueries({ queryKey: ["invoices", "stats"] });
    queryClient.invalidateQueries({ queryKey: ["quotes", "stats"] });
    queryClient.invalidateQueries({ queryKey: ["payment-audit-logs"] });
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <PageHeader title="Tableau de bord" subtitle={formatToday()}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Rafraîchir
        </Button>
      </PageHeader>

      <DashboardAlertsRow />
      <DashboardTreasuryRow />
      <DashboardProductionRow />
      <DashboardRecentActivity />
    </div>
  );
};
