// frontend/src/features/orders/components/OrderStatusBadge.tsx
import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "../types/orders.types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  waiting_for_file: { label: "En attente fichier", variant: "secondary" },
  in_progress: { label: "En cours", variant: "default" },
  file_completed: { label: "Fichier complet", variant: "outline" },
  printing_in_progress: { label: "Impression en cours", variant: "default" },
  cutting_in_progress: { label: "Découpe en cours", variant: "default" },
  ready_for_delivery: { label: "Prêt pour livraison", variant: "outline" },
  delivered: { label: "Livrée", variant: "outline" },
  cancelled: { label: "Annulée", variant: "destructive" },
};

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const config = statusConfig[status] || statusConfig.waiting_for_file;

  return <Badge variant={config.variant}>{config.label}</Badge>;
};
