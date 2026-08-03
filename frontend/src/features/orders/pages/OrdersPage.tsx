// frontend/src/features/orders/pages/OrdersPage.tsx
import { useState } from "react";
import { useOrders } from "../hooks/useOrders";
import { OrderFilters } from "../components/OrderFilters";
import { OrdersTable } from "../components/OrdersTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { TableStatusBar } from "@/components/shared/TableStatusBar";
// import { FailedTable } from "@/components/shared/FailedTable";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import type { OrdersQueryParams, Order } from "../types/orders.types";
import { OrderDetailDrawer } from "../components/OrderDetailDrawer";
import { EditOrderModal } from "../components/EditOrderModal";

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

  const { data, isLoading, refetch } = useOrders(queryParams);
  // const { deleteOrderMutation } = useOrderMutations();

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

  // const handleDelete = (order: Order) => {
  //   if (window.confirm(`Supprimer la commande ${order.designation} ?`)) {
  //     deleteOrderMutation.mutate(order.id);
  //   }
  // };

  // if (isError) {
  //   return (
  //     <FailedTable
  //       refetch={refetch}
  //       sujet="commandes"
  //       actionLabel="Réessayer"
  //     />
  //   );
  // }

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
        isOpen={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        orderId={selectedOrder?.id || null}
      />

      <EditOrderModal
        isOpen={editModalOpen}
        onOpenChange={setEditModalOpen}
        order={selectedOrder}
      />
    </div>
  );
};
