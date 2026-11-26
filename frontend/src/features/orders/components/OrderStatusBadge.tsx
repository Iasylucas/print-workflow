import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "../schema/orders.schema";
import { Loader2 } from "lucide-react";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<
  OrderStatus,
  { label: string; dot: string; pulse?: boolean }
> = {
  waiting_for_visual: {
    label: "En attente visuel",
    dot: "bg-warning",
    pulse: true,
  },
  waiting_for_file: { label: "En attente fichier", dot: "bg-warning" },
  in_progress: { label: "En cours", dot: "bg-info" },
  file_completed: { label: "Fichier complet", dot: "bg-info" },
  printing_in_progress: { label: "Impression en cours", dot: "bg-info" },
  cutting_in_progress: { label: "Découpe en cours", dot: "bg-info" },
  ready_for_delivery: { label: "Prêt pour livraison", dot: "bg-success" },
  delivered: { label: "Livrée", dot: "bg-muted-foreground/50" },
  cancelled: { label: "Annulée", dot: "bg-destructive" },
  not_applicable: { label: "Service", dot: "bg-muted-foreground/50" },
};

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const config = statusConfig[status] || statusConfig.waiting_for_file;

  return (
    <Badge
      variant="outline"
      className="gap-1.5 px-2 py-0.5 text-xs font-normal"
    >
      {config.pulse ? (
        <Loader2 className="size-3 shrink-0 animate-spin text-warning" />
      ) : (
        <span className={cn("size-2 shrink-0 rounded-full", config.dot)} />
      )}
      {config.label}
    </Badge>
  );
};
