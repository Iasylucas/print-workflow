// frontend/src/features/quotes/components/QuoteStatusBadge.tsx
import { Badge } from "@/components/ui/badge";
import type { QuoteStatus } from "../schema/quotes.schema";

interface QuoteStatusBadgeProps {
  status: QuoteStatus;
}

const statusConfig: Record<
  QuoteStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  pending: { label: "En attente", variant: "secondary" },
  converted: { label: "Converti", variant: "default" },
};

export const QuoteStatusBadge = ({ status }: QuoteStatusBadgeProps) => {
  const config = statusConfig[status] || statusConfig.pending;

  return <Badge variant={config.variant}>{config.label}</Badge>;
};
