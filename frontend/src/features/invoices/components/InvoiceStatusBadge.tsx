import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { InvoicePaymentStatus } from "../schema/invoices.schema";

interface InvoiceStatusBadgeProps {
  status: InvoicePaymentStatus;
}

const statusConfig: Record<
  InvoicePaymentStatus,
  { label: string; dot: string }
> = {
  unpaid: { label: "Non payée", dot: "bg-destructive" },
  partial: { label: "Partiellement payée", dot: "bg-warning" },
  paid: { label: "Payée", dot: "bg-success" },
};

export const InvoiceStatusBadge = ({ status }: InvoiceStatusBadgeProps) => {
  const config = statusConfig[status] || statusConfig.unpaid;

  return (
    <Badge
      variant="outline"
      className="gap-1.5 px-2 py-0.5 text-xs font-normal"
    >
      <span className={cn("size-2 shrink-0 rounded-full", config.dot)} />
      {config.label}
    </Badge>
  );
};
