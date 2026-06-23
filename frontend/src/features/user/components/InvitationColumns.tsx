import { createColumnHelper } from "@tanstack/react-table";
import { ChevronUp, ChevronDown, Trash2, Mail } from "lucide-react";
import type { Invitation, InvitationsQueryParams } from "../types/user.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const columnHelper = createColumnHelper<Invitation>();

interface CreateInvitationColumnsProps {
  sortBy: string;
  sortOrder: "asc" | "desc";
  handleSort: (column: InvitationsQueryParams["sortBy"]) => void;
  handleDeleteInvitation: (id: string) => void;
}

export const createInvitationColumns = ({
  sortBy,
  sortOrder,
  handleSort,
  handleDeleteInvitation,
}: CreateInvitationColumnsProps) => [
  columnHelper.accessor("email", {
    id: "email",
    header: () => (
      <div
        className="flex items-center gap-1 cursor-pointer select-none"
        onClick={() => handleSort("email")}
      >
        Email invité
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
    cell: (info) => {
      const invitation = info.row.original;
      return (
        <div className="flex items-center gap-2.5 max-w-full">
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
              invitation.isExpired
                ? "bg-muted text-muted-foreground border-muted"
                : "bg-primary/5 text-primary border-primary/10",
            )}
          >
            <Mail size={14} className="stroke-[2.5]" />
          </div>
          <span
            className={cn(
              "font-medium truncate block",
              invitation.isExpired &&
                "text-muted-foreground line-through opacity-70",
            )}
            title={info.getValue()}
          >
            {info.getValue()}
          </span>
        </div>
      );
    },
  }),

  columnHelper.accessor("role", {
    id: "role",
    header: "Rôle assigné",
    cell: (info) => (
      <Badge
        variant="outline"
        className="font-medium text-[11px] px-2 py-0.5 uppercase tracking-wide"
      >
        {info.getValue()}
      </Badge>
    ),
  }),

  columnHelper.accessor("createdAt", {
    id: "createdAt",
    header: () => (
      <div
        className="flex items-center gap-1 cursor-pointer select-none"
        onClick={() => handleSort("createdAt")}
      >
        Envoyée le
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
      <span className="text-muted-foreground text-sm">
        {new Date(info.getValue()).toLocaleDateString()}
      </span>
    ),
  }),

  columnHelper.accessor("isExpired", {
    id: "expiresAt",
    header: () => (
      <div
        className="flex items-center gap-1 cursor-pointer select-none"
        onClick={() => handleSort("expiresAt")}
      >
        Statut / Expiration
        {sortBy === "expiresAt" && (
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
      const invitation = info.row.original;
      const isExpired = info.getValue();
      const expirationDate = new Date(invitation.expiresAt);

      return (
        <div className="flex flex-col gap-0.5">
          <div>
            {isExpired ? (
              <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                Expirée
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Active
              </span>
            )}
          </div>
          <span className="text-[11px] text-muted-foreground">
            {isExpired ? "Échue le : " : "Expire le : "}
            {expirationDate.toLocaleDateString()} à{" "}
            {expirationDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      );
    },
  }),

  columnHelper.display({
    id: "actions",
    header: () => <div className="text-right pr-2">Actions</div>,
    cell: (info) => {
      const invitation = info.row.original;
      return (
        <div className="flex justify-end pr-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors focus-visible:ring-0"
            onClick={() => handleDeleteInvitation(invitation.id)}
            title="Annuler cette invitation"
          >
            <Trash2 className="h-4 w-4 stroke-[2.2]" />
          </Button>
        </div>
      );
    },
  }),
];
