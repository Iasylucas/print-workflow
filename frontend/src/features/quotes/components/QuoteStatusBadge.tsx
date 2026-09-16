import { Badge } from "@/components/ui/badge";
import type { QuoteStatus } from "../schema/quotes.schema";

interface QuoteStatusBadgeProps {
  status: QuoteStatus;
}

const statusConfig: Record<
  QuoteStatus,
  {
    label: string;
    className: string;
  }
> = {
  pending: {
    label: "En attente",
    className:
      "border-transparent bg-yellow-500/10 text-yellow-600 dark:text-yellow-500",
  },
  converted: {
    label: "Converti",
    className:
      "border-transparent bg-green-500/10 text-green-600 dark:text-green-500",
  },
};

export const QuoteStatusBadge = ({ status }: QuoteStatusBadgeProps) => {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};
