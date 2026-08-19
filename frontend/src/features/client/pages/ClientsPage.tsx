import { useState } from "react";
import { useClients, useClientMutations } from "../hooks/useClients";
import type { ClientsQueryParams, Client } from "../types/client.types";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ClientFilters } from "../components/ClientFilters";
import { ClientTable } from "../components/ClientTable";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import { TableStatusBar } from "@/components/shared/TableStatusBar";
import { ClientFormModal } from "../components/ClientFormModal";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface ConfirmActionState {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  isDestructive?: boolean;
}

export const ClientsPage = () => {
  const { user } = useAuth();
  const [queryParams, setQueryParams] = useState<ClientsQueryParams>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
    search: "",
  });

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [confirmAction, setConfirmAction] = useState<ConfirmActionState>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const { data, isLoading } = useClients(queryParams);
  const { deleteMutation } = useClientMutations();

  const handleFilter = (filters: Partial<ClientsQueryParams>) => {
    setQueryParams((prev) => ({ ...prev, ...filters, page: 1 }));
  };

  const handleSort = (sortBy: ClientsQueryParams["sortBy"]) => {
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

  const handleDelete = (clientId: string) => {
    setConfirmAction({
      isOpen: true,
      title: "Supprimer le client ?",
      description:
        "Cette action est irréversible. Toutes les données liées à ce client seront archivées.",
      isDestructive: true,
      onConfirm: () => {
        deleteMutation.mutate(clientId);
        setConfirmAction((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setFormModalOpen(true);
  };

  if (user?.role !== "ADMIN" && user?.role !== "SALES") {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Clients"
        subtitle="Gérez vos clients : ajoutez, modifiez ou supprimez leurs informations."
      >
        <Button
          onClick={() => {
            setSelectedClient(null);
            setFormModalOpen(true);
          }}
          className="font-medium shadow-sm"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un client
        </Button>
      </PageHeader>

      <div className="space-y-4">
        <ClientFilters filters={queryParams} onFilterChange={handleFilter} />

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

        <ClientTable
          data={data}
          isLoading={isLoading}
          queryParams={queryParams}
          goToPage={goToPage}
          handleSort={handleSort}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>

      <ClientFormModal
        isOpen={formModalOpen}
        onOpenChange={setFormModalOpen}
        client={selectedClient}
      />

      {}
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
