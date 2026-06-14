import { createColumnHelper } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { User, UsersQueryParams } from "../types/user.types";

const columnHelper = createColumnHelper<User>();

interface CreateColumnsProps {
  sortBy: string;
  sortOrder: "asc" | "desc";
  handleSort: (column: UsersQueryParams["sortBy"]) => void;
  handleEdit: (user: User) => void;
  handleDelete: (userId: string) => void;
  handleStatusToggle: (user: User) => void;
}

export const createUserColumns = ({
  sortBy,
  sortOrder,
  handleSort,
  handleEdit,
  handleDelete,
  handleStatusToggle,
}: CreateColumnsProps) => [
  // 1. Colonne : Utilisateur (Avatar + Nom complet)
  columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
    id: "firstName", // Identifiant pour le tri API (on trie sur le prénom en BDD)
    header: () => (
      <div
        className="flex items-center gap-1 cursor-pointer select-none"
        onClick={() => handleSort("firstName")}
      >
        Utilisateurs
        {sortBy === "firstName" && (
          <span className="text-primary">
            {sortOrder === "asc" ? (
              <ChevronUp size={14} className="stroke-[2.5]" />
            ) : (
              <ChevronDown size={14} className="stroke-[2.5]" />
            )}
          </span>
        )}
      </div>
    ),
    cell: (info) => {
      const user = info.row.original;
      const initials =
        `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase();
      return (
        <div className="flex items-center gap-2 max-w-full">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={user.avatarUrl ?? undefined} />
            <AvatarFallback className="bg-primary/10 text-xs font-semibold rounded-[inherit]">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium truncate">
            {user.firstName} {user.lastName}
          </span>
        </div>
      );
    },
  }),

  // 2. Colonne : Email
  columnHelper.accessor("email", {
    id: "email",
    header: () => (
      <div
        className="flex items-center gap-1 cursor-pointer select-none"
        onClick={() => handleSort("email")}
      >
        Email
        {sortBy === "email" && (
          <span className="text-primary">
            {sortOrder === "asc" ? (
              <ChevronUp size={14} className="stroke-[2.5]" />
            ) : (
              <ChevronDown size={14} className="stroke-[2.5]" />
            )}
          </span>
        )}
      </div>
    ),
    cell: (info) => (
      <span className="truncate block" title={info.getValue()}>
        {info.getValue()}
      </span>
    ),
  }),

  // 3. Colonne : Rôle
  columnHelper.accessor("role", {
    id: "role",
    header: () => (
      <div
        className="flex items-center gap-1 cursor-pointer select-none"
        onClick={() => handleSort("role")}
      >
        Rôle
        {sortBy === "role" && (
          <span className="text-primary">
            {sortOrder === "asc" ? (
              <ChevronUp size={14} className="stroke-[2.5]" />
            ) : (
              <ChevronDown size={14} className="stroke-[2.5]" />
            )}
          </span>
        )}
      </div>
    ),
    cell: (info) => (
      <Badge variant="outline" className="font-medium text-[11px] px-2 py-0.5">
        {info.getValue()}
      </Badge>
    ),
  }),

  // 4. Colonne : Statut (Ton magnifique Switch interactif avec gestion Zod et anti-saccade)
  columnHelper.accessor("isActive", {
    id: "isActive",
    header: "Statut",
    cell: (info) => {
      const user = info.row.original;
      return (
        <div className="flex items-center gap-2">
          <Switch
            checked={user.isActive}
            onCheckedChange={() => handleStatusToggle(user)}
            className=" scale-90"
          />
          <span
            className={cn(
              "text-xs font-medium transition-colors",
              user.isActive ? "" : "text-muted-foreground opacity-60",
            )}
          >
            {user.isActive ? "Activé" : "Désactivé"}
          </span>
        </div>
      );
    },
  }),

  // 5. Colonne : Date d'inscription
  columnHelper.accessor("createdAt", {
    id: "createdAt",
    header: () => (
      <div
        className="flex items-center gap-1 cursor-pointer select-none"
        onClick={() => handleSort("createdAt")}
      >
        Inscrit le
        {sortBy === "createdAt" && (
          <span className="text-primary">
            {sortOrder === "asc" ? (
              <ChevronUp size={14} className="stroke-[2.5]" />
            ) : (
              <ChevronDown size={14} className="stroke-[2.5]" />
            )}
          </span>
        )}
      </div>
    ),
    cell: (info) => (
      <span>{new Date(info.getValue()).toLocaleDateString()}</span>
    ),
  }),

  // 6. Colonne : Actions (Le Dropdown Menu)
  columnHelper.display({
    id: "actions",
    cell: (info) => {
      const user = info.row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 focus-visible:ring-0"
            >
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="font-sans rounded-lg shadow-md"
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => handleEdit(user)}
              className="text-xs cursor-pointer gap-2"
            >
              <Pencil className="h-3.5 w-3.5 stroke-[2.5]" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive focus:bg-destructive/10 text-xs cursor-pointer gap-2"
              onClick={() => handleDelete(user.id)}
            >
              <Trash2 className="h-3.5 w-3.5 stroke-[2.5]" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];
