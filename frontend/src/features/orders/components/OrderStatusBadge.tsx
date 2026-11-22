import { Badge } from "@/components/ui/badge";
import { Check, Clock, Loader2, X, Printer, Calendar } from "lucide-react";
import type { OrderStatus } from "../schema/orders.schema";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    iconClass: string;
    className: string;
  }
> = {
  waiting_for_visual: {
    label: "En attente visuel",
    icon: Loader2,
    iconClass: "h-3 w-3 text-yellow-500 animate-spin rounded-full border-2 border-yellow-500/30 bg-yellow-500/5",
    className:
      "bg-background/20 border border-border rounded-xl text-foreground hover:bg-background/30 transition-colors",
  },
  waiting_for_file: {
    label: "En attente fichier",
    icon: Clock,
    iconClass: "h-3 w-3 text-yellow-600",
    className:
      "bg-background/20 border border-border rounded-xl text-foreground hover:bg-background/30 transition-colors",
  },
  in_progress: {
    label: "En cours",
    icon: Clock,
    iconClass: "h-3 w-3 text-blue-600",
    className:
      "bg-background/20 border border-border rounded-xl text-foreground hover:bg-background/30 transition-colors",
  },
  file_completed: {
    label: "Fichier complet",
    icon: Check,
    iconClass: "h-3 w-3 text-green-600",
    className:
      "bg-background/20 border border-border rounded-xl text-foreground hover:bg-background/30 transition-colors",
  },
  printing_in_progress: {
    label: "Impression en cours",
    icon: Printer,
    iconClass: "h-3 w-3 text-blue-500",
    className:
      "bg-background/20 border border-border rounded-xl text-foreground hover:bg-background/30 transition-colors",
  },
  cutting_in_progress: {
    label: "Découpe en cours",
    icon: Calendar,
    iconClass: "h-3 w-3 text-blue-500",
    className:
      "bg-background/20 border border-border rounded-xl text-foreground hover:bg-background/30 transition-colors",
  },
  ready_for_delivery: {
    label: "Prêt pour livraison",
    icon: Check,
    iconClass: "h-3 w-3 text-emerald-600 bg-emerald-500 rounded-full",
    className:
      "bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-600 hover:bg-emerald-500/30 transition-colors",
  },
  delivered: {
    label: "Livrée",
    icon: Check,
    iconClass: "h-3 w-3 text-green-600",
    className:
      "bg-background/20 border border-border rounded-xl text-foreground hover:bg-background/30 transition-colors",
  },
  cancelled: {
    label: "Annulée",
    icon: X,
    iconClass: "h-3 w-3 text-destructive",
    className:
      "bg-background/20 border border-border rounded-xl text-foreground hover:bg-background/30 transition-colors",
  },
  not_applicable: {
    label: "Service",
    icon: Calendar,
    iconClass: "h-3 w-3 text-muted-foreground",
    className:
      "bg-background/20 border border-border rounded-xl text-foreground hover:bg-background/30 transition-colors",
  },
};

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const config = statusConfig[status] || statusConfig.waiting_for_file;

  return (
    <Badge
      variant="outline"
      className={config.className}
    >
      <div className="flex items-center gap-1.5">
        <config.icon className={config.iconClass} />
        <span>{config.label}</span>
      </div>
    </Badge>
  );
};