import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronDown, History } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useOrderStatusHistory } from "../hooks/useOrderStatusHistory";
import { cn } from "@/lib/utils";
import { OrderStatusBadge } from "./OrderStatusBadge";

const PAGE_SIZE = 5;

interface OrderStatusHistoryTableProps {
  orderId: number;
}

export const OrderStatusHistoryTable = ({
  orderId,
}: OrderStatusHistoryTableProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(0);

  const { data, isLoading } = useOrderStatusHistory(isOpen ? orderId : null);

  const entries = data ?? [];
  const totalPages = Math.max(1, Math.ceil(entries.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const paginated = entries.slice(
    safePage * PAGE_SIZE,
    safePage * PAGE_SIZE + PAGE_SIZE,
  );

  const formatDate = (iso: string): string => {
    const d = new Date(iso);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-lg border bg-background/50 px-3 py-2 text-sm hover:bg-muted/50 transition-colors"
        >
          <span className="flex items-center gap-2 font-medium">
            <History className="h-4 w-4 text-muted-foreground" />
            Historique des statuts
            {entries.length > 0 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {entries.length}
              </Badge>
            )}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent className="w-full max-w-full overflow-hidden">
        <div className="mt-2 rounded-lg border bg-background/50 w-full max-w-[335px] overflow-hidden">
          {isLoading ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-7 animate-pulse rounded bg-muted" />
              ))}
            </div>
          ) : entries.length === 0 ? (
            <p className="p-4 text-xs text-muted-foreground text-center">
              Aucun changement enregistré.
            </p>
          ) : (
            <>
              <div className="max-h-[240px] w-full overflow-x-auto overflow-y-auto">
                <table className="text-xs">
                  <thead className="bg-muted/40 text-muted-foreground sticky top-0">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium whitespace-nowrap">
                        Date
                      </th>
                      <th className="text-left px-3 py-2 font-medium whitespace-nowrap">
                        Statut
                      </th>
                      <th className="text-left px-3 py-2 font-medium whitespace-nowrap">
                        Par
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((entry) => {
                      const author =
                        `${entry.changedBy.firstName ?? ""} ${entry.changedBy.lastName}`.trim();

                      return (
                        <tr
                          key={entry.id}
                          className="border-t border-border/50"
                        >
                          <td className="px-3 py-2 font-mono text-[11px] whitespace-nowrap">
                            {formatDate(entry.createdAt)}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <OrderStatusBadge status={entry.toStatus} />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            {author}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t px-3 py-2 text-xs">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    disabled={safePage === 0}
                    onClick={() => setPage(safePage - 1)}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                  <span className="text-muted-foreground">
                    {safePage + 1} / {totalPages}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    disabled={safePage >= totalPages - 1}
                    onClick={() => setPage(safePage + 1)}
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
