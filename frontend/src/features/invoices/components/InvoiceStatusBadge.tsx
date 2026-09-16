import { Badge } from "@/components/ui/badge";
import type { InvoicePaymentStatus } from "../schema/invoices.schema";

interface InvoiceStatusBadgeProps {
  status: InvoicePaymentStatus;
}

const statusConfig: Record<
  InvoicePaymentStatus,
  {
    label: string;
    className: string;
  }
> = {
  unpaid: {
    label: "Non payée",
    className: "border-transparent bg-destructive/10 text-destructive",
  },
  partial: {
    label: "Partiellement payée",
    className:
      "border-transparent bg-yellow-500/10 text-yellow-600 dark:text-yellow-500",
  },
  paid: {
    label: "Payée",
    className:
      "border-transparent bg-green-500/10 text-green-600 dark:text-green-500",
  },
};

export const InvoiceStatusBadge = ({ status }: InvoiceStatusBadgeProps) => {
  const config = statusConfig[status] || statusConfig.unpaid;

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};
