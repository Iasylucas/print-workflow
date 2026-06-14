import { useState } from "react";
import { useUsers, useUserMutations } from "../hooks/useUsers";
import type { UsersQueryParams, User } from "../types/user.types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  UserPlus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/shared/PageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserFilters } from "../components/UserFilters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserTable } from "../components/UserTable";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmActionState {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  isDestructive?: boolean; // Pour mettre le bouton de confirmation en rouge si c'est une suppression
}

export const UsersPage = () => {
  // États locaux pour les filtres et la pagination
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
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-destructive">
          Erreur lors du chargement des utilisateurs.
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      {/* En-tête de page principal */}
      <PageHeader
        title="Utilisateurs"
        subtitle="Gérez les comptes des collaborateurs, leurs rôles et leur statut."
      >
        {/* Tu places UNIQUEMENT ton bouton métier ici */}
        <Button
          onClick={() => setInviteModalOpen(true)}
          className="font-medium shadow-sm"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Inviter un utilisateur
        </Button>
      </PageHeader>

      <div className="space-y-4">
        {/* Filtres (à décommenter quand UserFilters sera créé) */}
        <UserFilters filters={queryParams} onFilterChange={handleFilter} />
        {/* 💡 BARRE D'ÉTAT INTERMÉDIAIRE : Entre les filtres et le tableau */}
        <div className="flex flex-row  justify-between items-center sm:items-center gap-2 text-xs text-muted-foreground px-1 py-1">
          {/* Zone Gauche : Compteur Total Dynamique */}
          <div className="font-medium font-sans">
            {isLoading ? (
              <span className="opacity-50">Calcul des collaborateurs...</span>
            ) : (
              <>
                Total :{" "}
                <span className="text-foreground font-semibold">
                  {data?.meta.total || 0}
                </span>{" "}
                utilisateur{(data?.meta.total || 0) > 1 ? "s" : ""}
              </>
            )}
          </div>

          {/* Zone Droite : Sélecteur de Lignes par Page (Rows per page) */}
          <div className="flex items-center gap-2 ml-auto sm:ml-0">
            <span className="font-sans">Lignes par page :</span>
            <Select
              value={String(queryParams.limit)}
              onValueChange={(val) => {
                setQueryParams((prev) => ({
                  ...prev,
                  limit: Number(val),
                  page: 1, // 💡 REGLE UX : Toujours forcer le retour à la page 1 si on change la taille du tableau !
                }));
              }}
            >
              <SelectTrigger className="h-7 w-[70px] bg-background/50 border-input rounded-md text-xs focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow-md font-sans">
                <SelectItem value="10" className="text-xs">
                  10
                </SelectItem>
                <SelectItem value="20" className="text-xs">
                  20
                </SelectItem>
                <SelectItem value="50" className="text-xs">
                  50
                </SelectItem>
                <SelectItem value="100" className="text-xs">
                  100
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Tableau des utilisateurs */}
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
      </div>
      <AlertDialog
        open={confirmAction.isOpen}
        onOpenChange={(open) =>
          setConfirmAction((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <AlertDialogContent className="rounded-lg shadow-md font-sans max-w-md animate-in fade-in zoom-in-95 duration-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold tracking-tight">
              {confirmAction.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground/90 leading-relaxed mt-1">
              {confirmAction.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel className="rounded-lg h-9 text-xs font-medium">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction.onConfirm}
              // 💡 SOLUTION PRO : On passe la variante destructive native de Shadcn si isDestructive est vrai
              variant={confirmAction.isDestructive ? "destructive" : "default"}
              className="rounded-lg h-9 text-xs font-medium shadow-xs"
            >
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
{
  /* Modals (à décommenter quand les composants seront créés) */
}
{
  /* <InviteUserModal
        open={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
      />
      <EditUserModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        user={selectedUser}
      /> */
}
// const [inviteModalOpen, setInviteModalOpen] = useState(false);
// const [editModalOpen, setEditModalOpen] = useState(false);
// const [selectedUser, setSelectedUser] = useState<User | null>(null);
