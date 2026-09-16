import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "../schema/orders.schema";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    className: string;
  }
> = {
  waiting_for_file: {
    label: "En attente fichier",
    className:
      "border-transparent bg-yellow-500/10 text-yellow-600 dark:text-yellow-500",
  },
  in_progress: {
    label: "En cours",
    className:
      "border-transparent bg-blue-500/10 text-blue-600 dark:text-blue-500",
  },
  file_completed: {
    label: "Fichier complet",
    className:
      "border-transparent bg-green-500/10 text-green-600 dark:text-green-500",
  },
  printing_in_progress: {
    label: "Impression en cours",
    className:
      "border-transparent bg-blue-500/10 text-blue-600 dark:text-blue-500",
  },
  cutting_in_progress: {
    label: "Découpe en cours",
    className:
      "border-transparent bg-blue-500/10 text-blue-600 dark:text-blue-500",
  },
  ready_for_delivery: {
    label: "Prêt pour livraison",
    className:
      "border-transparent bg-green-500/10 text-green-600 dark:text-green-500",
  },
  delivered: {
    label: "Livrée",
    className:
      "border-transparent bg-green-500/10 text-green-600 dark:text-green-500",
  },
  cancelled: {
    label: "Annulée",
    className: "border-transparent bg-destructive/10 text-destructive",
  },
};

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const config = statusConfig[status] || statusConfig.waiting_for_file;

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};
