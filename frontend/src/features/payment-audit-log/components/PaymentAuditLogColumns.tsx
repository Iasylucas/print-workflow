import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { PaymentAuditLog } from "../types/payment-audit-log.types";
import { cn } from "@/lib/utils";

const actionConfig: Record<
  PaymentAuditLog["action"],
  { label: string; className: string }
> = {
  CREATE: {
    label: "Création",
    className: "bg-emerald-500/15 text-emerald-600",
  },
  UPDATE: {
    label: "Modification",
    className: "bg-amber-500/15 text-amber-600",
  },
  DELETE: {
    label: "Suppression",
    className: "bg-destructive/15 text-destructive",
  },
};

export const paymentAuditLogColumns: ColumnDef<PaymentAuditLog>[] = [
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-sm whitespace-nowrap">
        {new Date(row.original.createdAt).toLocaleString("fr-FR")}
      </span>
    ),
  },
  {
    accessorKey: "user",
    header: "Utilisateur",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.user.firstName || ""} {row.original.user.lastName}
      </span>
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const config = actionConfig[row.original.action];
      return (
        <Badge
          variant="secondary"
          className={cn(
            "text-[10px] px-2 py-0.5 font-medium",
            config.className,
          )}
        >
          {config.label}
        </Badge>
      );
    },
  },
  {
    id: "invoiceNumber",
    header: "Facture",
    cell: ({ row }) => {
      const data = (row.original.newData ?? row.original.oldData) as {
        invoice?: { number?: string };
      } | null;
      const number = data?.invoice?.number;
      return <span className="text-sm font-mono">{number ?? "-"}</span>;
    },
  },
  {
    id: "amount",
    header: "Montant",
    cell: ({ row }) => {
      const data = (row.original.newData || row.original.oldData) as Record<
        string,
        unknown
      > | null;
      const amount = data?.amount as number | undefined;
      return (
        <span className="text-sm font-medium">
          {amount ? `${amount.toLocaleString()} Ar` : "-"}
        </span>
      );
    },
  },
  // {
  //   accessorKey: "reason",
  //   header: "Raison",
  //   cell: ({ row }) => (
  //     <span className="text-sm text-muted-foreground truncate block max-w-[150px]">
  //       {row.original.reason || "-"}
  //     </span>
  //   ),
  // },
];
