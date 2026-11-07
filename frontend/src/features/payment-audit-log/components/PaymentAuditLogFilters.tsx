import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Filter, RotateCcw } from "lucide-react";
import type {
  PaymentAuditAction,
  PaymentAuditLogQueryParams,
} from "../types/payment-audit-log.types";
import { getDefaultDateRange, toDateInputValue, toIsoDate } from "@/lib/date";

interface PaymentAuditLogFiltersProps {
  filters: PaymentAuditLogQueryParams;
  onFilterChange: (newFilters: Partial<PaymentAuditLogQueryParams>) => void;
  onReset: () => void;
}

const ACTIONS: PaymentAuditAction[] = ["CREATE", "UPDATE", "DELETE"];

const parseAction = (val: string): PaymentAuditAction | undefined => {
  if (val === "ALL") return undefined;
  return ACTIONS.includes(val as PaymentAuditAction)
    ? (val as PaymentAuditAction)
    : undefined;
};

export const PaymentAuditLogFilters = ({
  filters,
  onFilterChange,
  onReset,
}: PaymentAuditLogFiltersProps) => {
  const defaultRange = getDefaultDateRange();
  const defaultStart = toDateInputValue(defaultRange.start);
  const defaultEnd = toDateInputValue(defaultRange.end);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const hasSearch = !!filters.invoiceNumber;

  const handleReset = () => {
    onReset();
  };

  const hasActiveFilters = !!(
    filters.invoiceNumber ||
    filters.action ||
    filters.userId ||
    toDateInputValue(filters.startDate) !== defaultStart ||
    toDateInputValue(filters.endDate) !== defaultEnd
  );

  return (
    <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-3 w-full">
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <div
          onClick={() => searchInputRef.current?.focus()}
          className={cn(
            "relative h-9 flex items-center transition-all duration-300 ease-in-out border rounded-lg bg-background/50 cursor-pointer",
            hasSearch
              ? "w-full sm:w-[220px] px-3 border-primary/40 shadow-xs"
              : "w-9 sm:w-9 px-0 justify-center border-input hover:bg-muted/50 focus-within:w-full focus-within:sm:w-[220px] focus-within:px-3 focus-within:border-primary/40 focus-within:shadow-xs",
          )}
        >
          <Search className="h-4 w-4 text-muted-foreground/70 stroke-[2.5] shrink-0 pointer-events-none" />
          <Input
            ref={searchInputRef}
            placeholder="Rechercher une facture..."
            value={filters.invoiceNumber ?? ""}
            onChange={(e) =>
              onFilterChange({
                invoiceNumber: e.target.value || undefined,
                page: 1,
              })
            }
            className={cn(
              "h-full p-0 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 transition-all font-sans text-xs cursor-text",
              hasSearch
                ? "ml-2 w-full opacity-100"
                : "w-0 opacity-0 focus:ml-2 focus:w-full focus:opacity-100",
            )}
          />
          {hasSearch && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFilterChange({ invoiceNumber: undefined, page: 1 });
              }}
              className="text-muted-foreground/60 hover:text-foreground transition-colors p-0.5 rounded-md hover:bg-muted absolute right-2"
            >
              <X className="h-3 w-3 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-start sm:justify-end flex-wrap">
        <Select
          value={filters.action ?? "ALL"}
          onValueChange={(val) =>
            onFilterChange({ action: parseAction(val), page: 1 })
          }
        >
          <SelectTrigger className="h-9 min-w-[140px] bg-background/50 text-xs border-input rounded-lg">
            <Filter className="h-3.5 w-3.5 text-muted-foreground/70" />
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Toutes les actions</SelectItem>
            <SelectItem value="CREATE">Création</SelectItem>
            <SelectItem value="DELETE">Suppression</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 mr-4">
          <Input
            type="date"
            value={toDateInputValue(filters.startDate)}
            onChange={(e) =>
              onFilterChange({
                startDate: toIsoDate(e.target.value || undefined),
                page: 1,
              })
            }
            className="h-9 w-[140px] bg-background/50 text-xs border-input rounded-l-md"
            placeholder="Du"
          />
          <span className="text-xs text-muted-foreground/50">au</span>
          <Input
            type="date"
            value={toDateInputValue(filters.endDate)}
            onChange={(e) =>
              onFilterChange({
                endDate: toIsoDate(e.target.value || undefined),
                page: 1,
              })
            }
            className="h-9 w-[140px] bg-background/50 text-xs border-input rounded-r-md"
            placeholder="À"
          />
        </div>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            className="h-9 w-9 text-muted-foreground hover:text-primary border-input rounded-lg"
            title="Réinitialiser les filtres"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
};
