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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { UserFilters } from "../components/UserFilters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Composants à implémenter plus tard (on décommentera les imports quand ils seront créés)
// import { UserFilters } from "../components/UserFilters";
// import { InviteUserModal } from "../components/InviteUserModal";
// import { EditUserModal } from "../components/EditUserModal";
// import { Pagination } from "@/components/ui/pagination";

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

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Données et mutations
  const { data, isLoading, isError, refetch } = useUsers(queryParams);
  const { deleteMutation } = useUserMutations();

  const handleDelete = (userId: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      deleteMutation.mutate(userId);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  // Gestion de la pagination
  const totalPages = data?.meta.totalPages || 1;
  const currentPage = queryParams.page || 1;

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
        <div className="border rounded-md">
          <Table className="table-layout-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead
                  className="w-[25%] cursor-pointer"
                  onClick={() => handleSort("firstName")}
                >
                  Utilisateurs
                  {queryParams.sortBy === "firstName" && (
                    <span className="ml-1">
                      {queryParams.sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </TableHead>
                <TableHead
                  className="cursor-pointer w-[30%]"
                  onClick={() => handleSort("email")}
                >
                  Email
                  {queryParams.sortBy === "email" && (
                    <span className="ml-1">
                      {queryParams.sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </TableHead>
                <TableHead
                  className="w-[15%] cursor-pointer inline-flex items-center"
                  onClick={() => handleSort("role")}
                >
                  Rôle
                  {queryParams.sortBy === "role" && (
                    <span className="ml-1">
                      {queryParams.sortOrder === "asc" ? (
                        <ChevronUp size={15} />
                      ) : (
                        <ChevronDown size={15} />
                      )}
                    </span>
                  )}
                </TableHead>
                <TableHead className="w-[15%]">Statut</TableHead>
                <TableHead
                  className="w-[15%] cursor-pointer inline-flex items-center"
                  onClick={() => handleSort("createdAt")}
                >
                  Inscrit le
                  {queryParams.sortBy === "createdAt" && (
                    <span className="ml-1">
                      {queryParams.sortOrder === "asc" ? (
                        <ChevronUp size={15} />
                      ) : (
                        <ChevronDown size={15} />
                      )}
                    </span>
                  )}
                </TableHead>
                <TableHead className="w-15">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="hover:bg-transparent">
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-md bg-muted animate-pulse shrink-0" />
                        <div className="h-4 w-28 rounded-md bg-muted animate-pulse" />
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="h-4 w-40 rounded-md bg-muted animate-pulse" />
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="h-5 w-16 rounded-full bg-muted animate-pulse" />
                    </TableCell>

                    <TableCell className="py-3">
                      <div className="h-5 w-14 rounded-full bg-muted animate-pulse" />
                    </TableCell>

                    <TableCell className="py-3">
                      <div className="h-4 w-20 rounded-md bg-muted animate-pulse" />
                    </TableCell>

                    <TableCell className="py-3 text-right">
                      <div className="h-8 w-8 rounded-md bg-muted animate-pulse ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : data?.data?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-muted-foreground"
                  >
                    Aucun utilisateur trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {/* Avatar */}
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.avatarUrl} />
                          <AvatarFallback className="bg-primary/10 text-xs">
                            {`${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.isActive ? "default" : "secondary"}
                        className={cn(
                          user.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "",
                        )}
                      >
                        {user.isActive ? "Activé" : "Désactivé"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Ouvrir le menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(user)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {/* </div> */}

          {/* Bloc de Pagination Officiel Shadcn Corrigé */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/5 (ou vide pour ton unibody)">
              {/* Texte UX à gauche */}
              <p className="text-xs text-muted-foreground">
                Page {currentPage} sur {totalPages}
              </p>
              <Pagination>
                <PaginationContent>
                  {/* Bouton Précédent */}
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) goToPage(currentPage - 1);
                      }}
                      // Standard pro : on désactive visuellement et techniquement si on est sur la page 1
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {/* Génération propre des boutons de numéros */}
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            goToPage(pageNumber);
                          }}
                          isActive={currentPage === pageNumber}
                          className="cursor-pointer"
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  {/* Bouton Suivant */}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) goToPage(currentPage + 1);
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
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
