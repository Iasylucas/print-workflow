import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { usePaymentAuditLogs } from "@/features/payment-audit-log/hooks/usePaymentAuditLogs";
import type { PaymentAuditLog } from "@/features/payment-audit-log";

const ACTION_LABELS: Record<string, { label: string; className: string }> = {
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

export const DashboardRecentActivity = () => {
  const { data, isLoading } = usePaymentAuditLogs({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Dernières activités
        </h2>
        <Link
          to="/payment-audit-logs"
          className="text-xs text-primary hover:underline"
        >
          Voir tout →
        </Link>
      </div>
      <div className="rounded-xl border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-9 animate-pulse rounded-md bg-muted" />
            ))}
          </div>
        ) : !data?.data.length ? (
          <p className="p-4 text-sm text-muted-foreground">
            Aucune activité récente.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Date</th>
                <th className="text-left px-4 py-2 font-medium">Utilisateur</th>
                <th className="text-left px-4 py-2 font-medium">Action</th>
                <th className="text-left px-4 py-2 font-medium">Facture</th>
                <th className="text-right px-4 py-2 font-medium">Montant</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((log: PaymentAuditLog) => {
                const config = ACTION_LABELS[log.action];
                const snapshot = (log.newData ?? log.oldData) as {
                  invoice?: { number?: string };
                  amount?: number;
                } | null;
                return (
                  <tr key={log.id} className="border-t bg-background">
                    <td className="px-4 py-2 whitespace-nowrap text-xs">
                      {new Date(log.createdAt).toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-2">
                      {log.user.firstName} {log.user.lastName}
                    </td>
                    <td className="px-4 py-2">
                      <Badge
                        variant="secondary"
                        className={`text-[10px] px-2 py-0.5 ${config?.className ?? ""}`}
                      >
                        {config?.label ?? log.action}
                      </Badge>
                    </td>
                    <td className="px-4 py-2 font-mono text-xs">
                      {snapshot?.invoice?.number ?? "—"}
                    </td>
                    <td className="px-4 py-2 text-right font-medium">
                      {snapshot?.amount
                        ? `${snapshot.amount.toLocaleString("fr-FR")} Ar`
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};
