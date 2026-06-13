// src/features/user/components/UserFilters.tsx
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RotateCcw, X } from "lucide-react";
import type { UsersQueryParams } from "../types/user.types";
import type { UserRole } from "@/shared/schemas";
import { Search, ShieldAlert, ToggleLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserFiltersProps {
  filters: UsersQueryParams;
  onFilterChange: (newFilters: Partial<UsersQueryParams>) => void;
}

export const UserFilters = ({ filters, onFilterChange }: UserFiltersProps) => {
  // 💡 ÉTAT LOCAL ET ÉTAT MIROIR : On stocke la recherche actuelle et la dernière recherche reçue du parent
  const [localSearch, setLocalSearch] = useState(filters.search || "");
  const [prevSearch, setPrevSearch] = useState(filters.search || "");

  // 💡 SYNCHRONISATION ULTRA-PRO (Sans useEffect) :
  // Si le parent a réinitialisé la recherche (ex: clic sur Effacer), on met à jour l'état local DIRECTEMENT pendant le rendu.
  if (filters.search !== prevSearch) {
    setLocalSearch(filters.search || "");
    setPrevSearch(filters.search || "");
  }

  // ⏱️ UN UNIQUE DEBOUNCE EFFECT : Uniquement pour retarder l'envoi de la frappe vers l'API
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== (filters.search || "")) {
        onFilterChange({ search: localSearch, page: 1 });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, onFilterChange, filters.search]);

  // Conversion propre des valeurs pour le Select de Shadcn
  const currentRoleValue = filters.role || "ALL";
  const currentStatusValue =
    filters.isActive === undefined
      ? "ALL"
      : filters.isActive
        ? "ACTIVE"
        : "INACTIVE";

  const handleReset = () => {
    setLocalSearch("");
    setPrevSearch(""); // On vide aussi la mémoire de synchronisation
    onFilterChange({
      search: "",
      role: undefined,
      isActive: undefined,
      page: 1,
    });
  };

  const hasActiveFilters = !!(
    filters.search ||
    filters.role ||
    filters.isActive !== undefined
  );

  return (
    // <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full pb-2">
    <div className="flex flex-col-reverse sm:flex-row items-end sm:items-center justify-between gap-3 w-full pb-0">
      {/* ZONE GAUCHE : Les filtres sélecteurs */}
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto  order-2 sm:order-1">
        {/* Sélecteur de Rôle */}
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

        {/* Sélecteur de Statut */}
        <Select
          value={currentStatusValue}
          onValueChange={(val) => {
            onFilterChange({
              isActive: val === "ALL" ? undefined : val === "ACTIVE",
              page: 1,
            });
          }}
        >
          <SelectTrigger className="h-9 min-w-[120px] bg-background/50 text-xs font-medium border-input rounded-lg hover:bg-muted/50 transition-colors gap-2 focus:ring-0">
            <ToggleLeft className="h-3.5 w-3.5 text-muted-foreground/70 stroke-[2.5]" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent className="rounded-lg shadow-md font-sans">
            <SelectItem value="ALL" className="text-xs">
              Tous les statuts
            </SelectItem>
            <SelectItem value="ACTIVE" className="text-xs">
              Activé
            </SelectItem>
            <SelectItem value="INACTIVE" className="text-xs">
              Désactivé
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ZONE DROITE : Recherche rétractable et Réinitialisation */}
      {/* 💡 Correction : justify-start (à gauche) par défaut sur mobile, sm:justify-end (à droite) sur PC */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-start sm:justify-end order-1 sm:order-2">
        {/* Barre de recherche "Bouton dépliable" */}
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
            placeholder="Rechercher..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className={cn(
              "h-full p-0 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 transition-all font-sans text-xs cursor-text",
              localSearch
                ? "ml-2 w-full opacity-100"
                : "w-0 opacity-0 focus:ml-2 focus:w-full focus:opacity-100",
            )}
          />

          {/* Petite croix interne */}
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

        {/* 💡 LA CORRECTION PRO FLUIDE : Plus de changement de w-9/w-0, juste du GPU ! */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            className={cn(
              "h-9 w-9 min-w-9 text-muted-foreground hover:text-primary hover:bg-primary/5 border-input rounded-lg shadow-xs",
              // Classes d'animations ultra-fluides de Tailwind/Shadcn (Entrée douce, sortie instantanée ou fondue sans bouger le reste)
              "animate-in fade-in zoom-in-95 duration-200",
            )}
            title="Réinitialiser tous les filtres"
          >
            <RotateCcw className="h-3.5 w-3.5 stroke-[2.5]" />
          </Button>
        )}
      </div>
    </div>
  );
};
