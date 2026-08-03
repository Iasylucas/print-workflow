// frontend/src/features/invoices/components/InvoiceFilters.tsx
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
import { Search, X, Filter, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { INVOICE_PAYMENT_STATUSES } from "../schema/invoices.schema";
import type { InvoicesQueryParams } from "../types/invoices.types";
import type { InvoicePaymentStatus } from "../schema/invoices.schema";

interface InvoiceFiltersProps {
  filters: InvoicesQueryParams;
  onFilterChange: (newFilters: Partial<InvoicesQueryParams>) => void;
}

const statusLabels: Record<InvoicePaymentStatus, string> = {
  unpaid: "Non payée",
  partial: "Partiellement payée",
  paid: "Payée",
};

export const InvoiceFilters = ({
  filters,
  onFilterChange,
}: InvoiceFiltersProps) => {
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
      status: undefined,
      clientId: undefined,
      isDelivered: undefined,
      startDate: undefined,
      endDate: undefined,
      page: 1,
    });
  };

  const hasActiveFilters = !!(
    filters.search ||
    filters.status ||
    filters.clientId ||
    filters.isDelivered !== undefined ||
    filters.startDate ||
    filters.endDate
  );

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
            placeholder="Rechercher une facture..."
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

      {/* Filtres à droite */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-start sm:justify-end flex-wrap">
        {/* Filtre Statut de paiement */}
        <Select
          value={filters.status || "ALL"}
          onValueChange={(val) =>
            onFilterChange({
              status: val === "ALL" ? undefined : (val as InvoicePaymentStatus),
              page: 1,
            })
          }
        >
          <SelectTrigger className="h-9 min-w-[140px] bg-background/50 text-xs font-medium border-input rounded-lg hover:bg-muted/50 transition-colors gap-2 focus:ring-0">
            <Filter className="h-3.5 w-3.5 text-muted-foreground/70 stroke-[2.5]" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent className="rounded-lg shadow-md font-sans">
            <SelectItem value="ALL" className="text-xs">
              Tous les statuts
            </SelectItem>
            {INVOICE_PAYMENT_STATUSES.map((status) => (
              <SelectItem key={status} value={status} className="text-xs">
                {statusLabels[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtre Livrée / Non livrée */}
        <Select
          value={
            filters.isDelivered === undefined
              ? "ALL"
              : filters.isDelivered
                ? "DELIVERED"
                : "NOT_DELIVERED"
          }
          onValueChange={(val) => {
            onFilterChange({
              isDelivered:
                val === "ALL" ? undefined : val === "DELIVERED" ? true : false,
              page: 1,
            });
          }}
        >
          <SelectTrigger className="h-9 min-w-[130px] bg-background/50 text-xs font-medium border-input rounded-lg hover:bg-muted/50 transition-colors gap-2 focus:ring-0">
            <Filter className="h-3.5 w-3.5 text-muted-foreground/70 stroke-[2.5]" />
            <SelectValue placeholder="Livraison" />
          </SelectTrigger>
          <SelectContent className="rounded-lg shadow-md font-sans">
            <SelectItem value="ALL" className="text-xs">
              Tous
            </SelectItem>
            <SelectItem value="DELIVERED" className="text-xs">
              Livrée
            </SelectItem>
            <SelectItem value="NOT_DELIVERED" className="text-xs">
              Non livrée
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Filtre Date De */}
        <div className="flex items-center gap-1">
          <Label className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
            Du
          </Label>
          <Input
            type="date"
            value={
              filters.startDate
                ? new Date(filters.startDate).toISOString().split("T")[0]
                : ""
            }
            onChange={(e) => {
              const val = e.target.value;
              onFilterChange({
                startDate: val ? new Date(val).toISOString() : undefined,
                page: 1,
              });
            }}
            className="h-9 w-[130px] text-xs bg-background/50 border-input rounded-lg hover:bg-muted/50 transition-colors"
          />
        </div>

        {/* Filtre Date Au */}
        <div className="flex items-center gap-1">
          <Label className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
            Au
          </Label>
          <Input
            type="date"
            value={
              filters.endDate
                ? new Date(filters.endDate).toISOString().split("T")[0]
                : ""
            }
            onChange={(e) => {
              const val = e.target.value;
              onFilterChange({
                endDate: val ? new Date(val).toISOString() : undefined,
                page: 1,
              });
            }}
            className="h-9 w-[130px] text-xs bg-background/50 border-input rounded-lg hover:bg-muted/50 transition-colors"
          />
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
            title="Réinitialiser tous les filtres"
          >
            <RotateCcw className="h-3.5 w-3.5 stroke-[2.5]" />
          </Button>
        )}
      </div>
    </div>
  );
};
