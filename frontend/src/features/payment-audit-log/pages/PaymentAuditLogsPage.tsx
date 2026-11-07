import { useState } from "react";
import { Navigate } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { TableStatusBar } from "@/components/shared/TableStatusBar";
import { FailedTable } from "@/components/shared/FailedTable";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Activity, PlusCircle, Trash2, Wallet } from "lucide-react";
import { PaymentAuditLogFilters } from "../components/PaymentAuditLogFilters";
import { PaymentAuditLogTable } from "../components/PaymentAuditLogTable";
import { PaymentAuditLogDetailModal } from "../components/PaymentAuditLogDetailModal";
import {
  usePaymentAuditLogs,
  usePaymentAuditLogStats,
} from "../hooks/usePaymentAuditLogs";
import type {
  PaymentAuditLog,
  PaymentAuditLogQueryParams,
} from "../types/payment-audit-log.types";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { KpiCard } from "@/components/shared/KpiCard";
import { getDefaultDateRange, toIsoDate } from "@/lib/date";

export const PaymentAuditLogsPage = () => {
  const { user } = useAuth();

  const buildDefaultQueryParams = (): PaymentAuditLogQueryParams => {
    const range = getDefaultDateRange();
    return {
      page: 1,
      limit: 20,
      startDate: toIsoDate(range.start),
      endDate: toIsoDate(range.end),
      invoiceNumber: undefined,
      action: undefined,
      userId: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    };
  };

  const [queryParams, setQueryParams] = useState<PaymentAuditLogQueryParams>(
    buildDefaultQueryParams,
  );

  const [selectedLog, setSelectedLog] = useState<PaymentAuditLog | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);

  const { data, isLoading, isError, refetch } =
    usePaymentAuditLogs(queryParams);

  const { data: stats, isLoading: isStatsLoading } = usePaymentAuditLogStats({
    startDate: queryParams.startDate,
    endDate: queryParams.endDate,
    invoiceNumber: queryParams.invoiceNumber,
    action: queryParams.action,
    userId: queryParams.userId,
  });

  const handleFilter = (filters: Partial<PaymentAuditLogQueryParams>) => {
    setQueryParams((prev) => ({ ...prev, ...filters, page: 1 }));
  };

  const handleResetFilters = () => {
    setQueryParams(buildDefaultQueryParams());
  };

  const goToPage = (page: number) => {
    setQueryParams((prev) => ({ ...prev, page }));
  };

  const handleRowClick = (log: PaymentAuditLog) => {
    setSelectedLog(log);
    setDetailSheetOpen(true);
  };

  if (user?.role !== "ADMIN") {
    return <Navigate to="/unauthorized" replace />;
  }

  if (isError) {
    return <FailedTable refetch={refetch} sujet="historique des paiements" />;
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Historique des paiements"
        subtitle="Consultez toutes les actions effectuées sur les paiements (création, modification, suppression)."
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total encaissé"
          value={`${(stats?.revenue ?? 0).toLocaleString("fr-FR")} Ar`}
          icon={Wallet}
          variant="success"
          isLoading={isStatsLoading}
          description="Paiements valides sur la période"
        />
        <KpiCard
          label="Total actions"
          value={stats?.totalActions ?? 0}
          icon={Activity}
          isLoading={isStatsLoading}
          description="Sur la période sélectionnée"
        />
        <KpiCard
          label="Créations"
          value={stats?.totalCreations ?? 0}
          icon={PlusCircle}
          variant="success"
          isLoading={isStatsLoading}
        />
        <KpiCard
          label="Suppressions"
          value={stats?.totalDeletions ?? 0}
          icon={Trash2}
          variant="destructive"
          isLoading={isStatsLoading}
        />
      </div>

      <div className="space-y-4">
        <PaymentAuditLogFilters
          filters={queryParams}
          onFilterChange={handleFilter}
          onReset={handleResetFilters}
        />

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

        <PaymentAuditLogTable
          data={data}
          isLoading={isLoading}
          queryParams={queryParams}
          goToPage={goToPage}
          onRowClick={handleRowClick}
        />
      </div>

      <PaymentAuditLogDetailModal
        isOpen={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        log={selectedLog}
      />
    </div>
  );
};
