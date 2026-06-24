import { useState } from "react";
import { useUsers, useUserMutations, useInvitations } from "../hooks/useUsers";
import type {
  UsersQueryParams,
  User,
  InvitationsQueryParams,
} from "../types/user.types";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { UserFilters } from "../components/UserFilters";
import { UserTable } from "../components/UserTable";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { FailedTable } from "@/components/shared/FailedTable";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import { TableStatusBar } from "@/components/shared/TableStatusBar";
import { EditUserModal } from "../components/EditUserModal";
import { InviteUserModal } from "../components/InviteUserModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvitationFilters } from "../components/InvitationFilters";
import { InvitationTable } from "../components/InvitationTable";

interface ConfirmActionState {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  isDestructive?: boolean;
}

export const UsersPage = () => {
  // Invitation state
  const [activeTab, setActiveTab] = useState<"users" | "invitations">("users");
  const [invitationParams, setInvitationParams] =
    useState<InvitationsQueryParams>({
      page: 1,
      limit: 20,
      sortBy: "createdAt",
      sortOrder: "desc",
      search: "",
      role: undefined,
    });
  const { data: invitationsData, isLoading: isInvitationsLoading } =
    useInvitations(invitationParams);
  const { cancelInvitationMutation } = useUserMutations();
  const handleDeleteInvitation = (invitationId: string) => {
    setConfirmAction({
      isOpen: true,
      title: "Annuler l'invitation ?",
      description:
        "Ce lien d'invitation sera définitivement désactivé. Le destinataire ne pourra plus utiliser ce jeton pour s'inscrire.",
      isDestructive: true,
      onConfirm: () => {
        cancelInvitationMutation.mutate(invitationId);
        setConfirmAction((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const goToInvitationPage = (page: number) => {
    setInvitationParams((prev) => ({ ...prev, page }));
  };

  const handleInvitationSort = (sortBy: InvitationsQueryParams["sortBy"]) => {
    setInvitationParams((prev) => ({
      ...prev,
      sortBy,
      sortOrder:
        prev.sortBy === sortBy && prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };
  const handleInvitationFilter = (filters: Partial<InvitationsQueryParams>) => {
    // Correction du type ici
    setInvitationParams((prev) => ({ ...prev, ...filters, page: 1 })); // Correction ici
  };
  // User State
  const [queryParams, setQueryParams] = useState<UsersQueryParams>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
    isActive: undefined,
    search: "",
    role: undefined,
  });

  const [confirmAction, setConfirmAction] = useState<ConfirmActionState>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  // Données et mutations
  const { data, isLoading, isError, refetch } = useUsers(queryParams);
  const { deleteMutation, updateMutation } = useUserMutations();

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleDelete = (userId: string) => {
    setConfirmAction({
      isOpen: true,
      title: "Supprimer l'utilisateur ?",
      description:
        "Cette action est irréversible. Le collaborateur perdra immédiatement l'accès à son compte et ses données seront archivées.",
      isDestructive: true,
      onConfirm: () => {
        deleteMutation.mutate(userId);
        setConfirmAction((prev) => ({ ...prev, isOpen: false })); // Ferme l'alerte
      },
    });
  };

  const handleStatusToggle = (user: User) => {
    const actionText = user.isActive ? "désactiver" : "activer";
    const newStatusText = user.isActive ? "Désactivation" : "Activation";

    setConfirmAction({
      isOpen: true,
      title: `${newStatusText} du compte`,
      description: `Voulez-vous vraiment ${actionText} le compte de ${user.firstName} ${user.lastName} ?`,
      isDestructive: user.isActive, // Rouge si on désactive, couleur standard si on active
      onConfirm: () => {
        updateMutation.mutate({
          id: user.id,
          data: { isActive: !user.isActive },
        });
        setConfirmAction((prev) => ({ ...prev, isOpen: false })); // Ferme l'alerte
      },
    });
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const goToPage = (page: number) => {
    setQueryParams((prev) => ({ ...prev, page }));
  };

  // Gestion du tri
  const handleSort = (sortBy: UsersQueryParams["sortBy"]) => {
    setQueryParams((prev) => ({
      ...prev,
      sortBy,
      sortOrder:
        prev.sortBy === sortBy && prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  // Gestion des filtres (sera délégué à UserFilters plus tard)
  const handleFilter = (filters: Partial<UsersQueryParams>) => {
    setQueryParams((prev) => ({ ...prev, ...filters, page: 1 }));
  };

  if (isError) {
    return <FailedTable refetch={refetch} sujet="utilisateurs" />;
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Utilisateurs"
        subtitle="Gérez les comptes des collaborateurs, leurs rôles et leur statut."
      >
        <Button
          onClick={() => setInviteModalOpen(true)}
          className="font-medium shadow-sm"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Inviter un utilisateur
        </Button>
      </PageHeader>
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "users" | "invitations")}
        className="w-full"
      >
        <TabsList className="mb-2 bg-muted/60">
          <TabsTrigger value="users" className="text-xs font-medium">
            Collaborateurs
          </TabsTrigger>
          <TabsTrigger value="invitations" className="text-xs font-medium">
            Invitations en attente
          </TabsTrigger>
        </TabsList>

        <div className="space-y-2">
          <TabsContent value="users" className="space-y-4">
            <UserFilters filters={queryParams} onFilterChange={handleFilter} />
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

            <UserTable
              data={data}
              isLoading={isLoading}
              queryParams={queryParams}
              goToPage={goToPage}
              handleSort={handleSort}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handleStatusToggle={handleStatusToggle}
            />
          </TabsContent>
          <TabsContent value="invitations" className="space-y-4">
            <InvitationFilters
              filters={invitationParams}
              onFilterChange={handleInvitationFilter}
            />
            <TableStatusBar
              totalCount={invitationsData?.meta.total || 0}
              limit={invitationParams.limit} // Correction ici pour lire la limite de l'invitation
              isLoading={isInvitationsLoading}
              onLimitChange={(val) => {
                setInvitationParams((prev) => ({
                  // Correction ici pour mettre à jour l'invitation
                  ...prev,
                  limit: Number(val),
                  page: 1,
                }));
              }}
            />
            <InvitationTable
              data={invitationsData}
              isLoading={isInvitationsLoading}
              queryParams={invitationParams}
              goToPage={goToInvitationPage}
              handleSort={handleInvitationSort}
              handleDeleteInvitation={handleDeleteInvitation}
            />
          </TabsContent>
        </div>
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
        <InviteUserModal
          isOpen={inviteModalOpen}
          onOpenChange={setInviteModalOpen}
        />
        <EditUserModal
          isOpen={editModalOpen}
          onOpenChange={setEditModalOpen}
          user={selectedUser}
        />
      </Tabs>
    </div>
  );
};
