import { useState } from "react";
import { useOrders, useOrderStats } from "../hooks/useOrders";
import { OrderFilters } from "../components/OrderFilters";
import { OrdersTable } from "../components/OrdersTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { TableStatusBar } from "@/components/shared/TableStatusBar";
import { Button } from "@/components/ui/button";
import { RefreshCw, Clock, Printer, PackageCheck, File } from "lucide-react";
import type { OrdersQueryParams, Order } from "../types/orders.types";
import { OrderDetailDrawer } from "../components/OrderDetailDrawer";
import { EditOrderModal } from "../components/EditOrderModal";
import { KpiCard } from "@/components/shared/KpiCard";
import { useSearchParams } from "react-router-dom";

export const OrdersPage = () => {
  const [queryParams, setQueryParams] = useState<OrdersQueryParams>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
    search: undefined,
    status: undefined,
    clientId: undefined,
  });

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const openOrderId = searchParams.get("openOrder");
  const orderIdFromUrl = openOrderId ? Number(openOrderId) : null;

  const { data, isLoading, refetch } = useOrders(queryParams);
  const { data: stats, isLoading: isStatsLoading } = useOrderStats();

  const handleFilter = (filters: Partial<OrdersQueryParams>) => {
    setQueryParams((prev) => ({ ...prev, ...filters, page: 1 }));
  };

  const handleSort = (sortBy: OrdersQueryParams["sortBy"]) => {
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

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setDetailDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setSelectedOrder(null);
    setDetailDrawerOpen(false);
    if (searchParams.has("openOrder")) {
      const next = new URLSearchParams(searchParams);
      next.delete("openOrder");
      setSearchParams(next, { replace: true });
    }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Commandes"
        subtitle="Gérez toutes les commandes de production et suivez leur statut."
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
          label="En attente visuel"
          value={stats?.waitingForVisual ?? 0}
          icon={Clock}
          variant="warning"
          description="Commandes en attente de visuel client"
        />

        <KpiCard
          label="En attente fichier"
          value={stats?.waitingForFile ?? 0}
          icon={File}
          variant="warning"
          description="En attente du fichier graphiste"
        />
        <KpiCard
          label="En production"
          value={stats?.inProduction ?? 0}
          icon={Printer}
          isLoading={isStatsLoading}
          description="Impression et découpe en cours"
        />
        <KpiCard
          label="Prêt pour livraison"
          value={stats?.readyForDelivery ?? 0}
          icon={PackageCheck}
          variant="success"
          isLoading={isStatsLoading}
          description="En attente d'action commerciale"
        />
      </div>

      <div className="space-y-4">
        <OrderFilters filters={queryParams} onFilterChange={handleFilter} />

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

        <OrdersTable
          data={data}
          isLoading={isLoading}
          queryParams={queryParams}
          goToPage={goToPage}
          handleSort={handleSort}
          onRowClick={(row) => handleView(row)}
        />
      </div>

      <OrderDetailDrawer
        key={selectedOrder?.id ?? orderIdFromUrl ?? "closed"}
        isOpen={detailDrawerOpen || !!orderIdFromUrl}
        onOpenChange={(open) => {
          if (!open) handleDrawerClose();
          else setDetailDrawerOpen(true);
        }}
        orderId={selectedOrder?.id ?? orderIdFromUrl}
      />

      <EditOrderModal
        isOpen={editModalOpen}
        onOpenChange={setEditModalOpen}
        order={selectedOrder}
      />
    </div>
  );
};
