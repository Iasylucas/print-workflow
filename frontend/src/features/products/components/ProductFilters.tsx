// frontend/src/features/products/components/ProductFilters.tsx
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductQueryParams } from "../types/products.types";

interface ProductFiltersProps {
  filters: ProductQueryParams;
  onFilterChange: (newFilters: Partial<ProductQueryParams>) => void;
}

export const ProductFilters = ({
  filters,
  onFilterChange,
}: ProductFiltersProps) => {
  const [localSearch, setLocalSearch] = useState(filters.search || "");

  useEffect(() => {
    setLocalSearch(filters.search || "");
  }, [filters.search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== (filters.search || "")) {
        onFilterChange({ search: localSearch || undefined, page: 1 });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, onFilterChange, filters.search]);

  const handleReset = () => {
    setLocalSearch("");
    onFilterChange({
      search: undefined,
      page: 1,
    });
  };

  const hasActiveFilters = !!filters.search;

  return (
    <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-3 w-full pb-0">
      {/* Barre de recherche */}
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <div
          onClick={(e) => {
            const input = e.currentTarget.querySelector("input");
            if (input) input.focus();
          }}
          className={cn(
            "relative h-9 flex items-center transition-all duration-300 ease-in-out border rounded-lg bg-background/50 cursor-pointer",
            localSearch
              ? "w-full sm:w-[220px] px-3 border-primary/40 shadow-xs"
              : "w-9 sm:w-9 px-0 justify-center border-input hover:bg-muted/50 focus-within:w-full focus-within:sm:w-[220px] focus-within:px-3 focus-within:border-primary/40 focus-within:shadow-xs",
          )}
        >
          <Search className="h-4 w-4 text-muted-foreground/70 stroke-[2.5] shrink-0 pointer-events-none" />
          <Input
            placeholder="Rechercher un produit..."
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

      {/* Bouton Reset */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="icon"
          onClick={handleReset}
          className={cn(
            "h-9 w-9 min-w-9 text-muted-foreground hover:text-primary hover:bg-primary/5 border-input rounded-lg shadow-xs",
            "animate-in fade-in zoom-in-95 duration-200",
          )}
          title="Réinitialiser les filtres"
        >
          <RotateCcw className="h-3.5 w-3.5 stroke-[2.5]" />
        </Button>
      )}
    </div>
  );
};
