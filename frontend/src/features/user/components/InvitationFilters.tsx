import { useState, useEffect } from "react";
import { Search, X, ShieldAlert, RotateCcw } from "lucide-react";
import type { InvitationsQueryParams } from "../types/user.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/shared/schemas";

interface InvitationFiltersProps {
  filters: InvitationsQueryParams;
  onFilterChange: (newFilters: Partial<InvitationsQueryParams>) => void;
}

export const InvitationFilters = ({
  filters,
  onFilterChange,
}: InvitationFiltersProps) => {
  const [localSearch, setLocalSearch] = useState(filters.search || "");
  const [prevSearch, setPrevSearch] = useState(filters.search || "");

  // Synchronisation sécurisée si le filtre de recherche change depuis l'extérieur (ex: reset)
  if (filters.search !== prevSearch) {
    setLocalSearch(filters.search || "");
    setPrevSearch(filters.search || "");
  }

  // Effet de Debounce (300ms) pour éviter de surcharger l'API Postgres à chaque frappe de touche
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== (filters.search || "")) {
        onFilterChange({ search: localSearch, page: 1 });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, onFilterChange, filters.search]);

  const currentRoleValue = filters.role || "ALL";

  // Action de réinitialisation complète des filtres de l'onglet
  const handleReset = () => {
    setLocalSearch("");
    setPrevSearch("");
    onFilterChange({
      search: "",
      role: undefined,
      page: 1,
    });
  };

  const hasActiveFilters = !!(filters.search || filters.role);

  return (
    <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-3 w-full pb-0">
      {/* Partie Gauche : Recherche animée rétractable */}
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <div
          onClick={(e) => {
            const input = e.currentTarget.querySelector("input");
            if (input) input.focus();
          }}
          className={cn(
            "relative h-9 flex items-center transition-all duration-300 ease-in-out border rounded-lg bg-background/50 cursor-pointer",
            localSearch
              ? "w-full sm:w-[240px] px-3 border-primary/40 shadow-xs"
              : "w-9 sm:w-9 px-0 justify-center border-input hover:bg-muted/50 focus-within:w-full focus-within:sm:w-[240px] focus-within:px-3 focus-within:border-primary/40 focus-within:shadow-xs",
          )}
        >
          <Search className="h-4 w-4 text-muted-foreground/70 stroke-[2.5] shrink-0 pointer-events-none" />

          <Input
            placeholder="Rechercher un e-mail..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className={cn(
              "h-full p-0 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 transition-all font-sans text-xs cursor-text",
              localSearch
                ? "ml-2 w-full opacity-100"
                : "w-0 opacity-0 focus:ml-2 focus:w-full focus:opacity-100",
            )}
          />

          {localSearch && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLocalSearch("");
              }}
              className="text-muted-foreground/60 hover:text-foreground transition-colors p-0.5 rounded-md hover:bg-muted absolute right-2"
            >
              <X className="h-3 w-3 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      {/* Partie Droite : Sélections et actions */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
        {/* Filtre par Rôle assigné */}
        <Select
          value={currentRoleValue}
          onValueChange={(val) =>
            onFilterChange({
              role: val === "ALL" ? undefined : (val as UserRole),
              page: 1,
            })
          }
        >
          <SelectTrigger className="h-9 min-w-[130px] bg-background/50 text-xs font-medium border-input rounded-lg hover:bg-muted/50 transition-colors gap-2 focus:ring-0">
            <ShieldAlert className="h-3.5 w-3.5 text-muted-foreground/70 stroke-[2.5]" />
            <SelectValue placeholder="Rôle" />
          </SelectTrigger>
          <SelectContent className="rounded-lg shadow-md font-sans">
            <SelectItem value="ALL" className="text-xs">
              Tous les rôles
            </SelectItem>
            <SelectItem value="ADMIN" className="text-xs">
              Admin
            </SelectItem>
            <SelectItem value="SALES" className="text-xs">
              Commercial
            </SelectItem>
            <SelectItem value="PRINTER" className="text-xs">
              Imprimeur
            </SelectItem>
            <SelectItem value="GRAPHIC_DESIGNER" className="text-xs">
              Graphiste
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Bouton de remise à zéro dynamique */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            className={cn(
              "h-9 w-9 min-w-9 text-muted-foreground hover:text-primary hover:bg-primary/5 border-input rounded-lg shadow-xs",
              "animate-in fade-in zoom-in-95 duration-200",
            )}
            title="Réinitialiser tous les filtres d'invitations"
          >
            <RotateCcw className="h-3.5 w-3.5 stroke-[2.5]" />
          </Button>
        )}
      </div>
    </div>
  );
};
