// frontend/src/features/invoices/components/InvoiceStatusBadge.tsx
import { Badge } from "@/components/ui/badge";
import type { InvoicePaymentStatus } from "../types/invoices.types";

interface InvoiceStatusBadgeProps {
  status: InvoicePaymentStatus;
}

const statusConfig: Record<
  InvoicePaymentStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  unpaid: { label: "Non payée", variant: "destructive" },
  partial: { label: "Partiellement payée", variant: "secondary" },
  paid: { label: "Payée", variant: "default" },
};

export const InvoiceStatusBadge = ({ status }: InvoiceStatusBadgeProps) => {
  const config = statusConfig[status] || statusConfig.unpaid;

  return <Badge variant={config.variant}>{config.label}</Badge>;
};
