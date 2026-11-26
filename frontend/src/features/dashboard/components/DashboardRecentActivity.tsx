// import { Link } from "react-router-dom";
// import { Badge } from "@/components/ui/badge";
// import { usePaymentAuditLogs } from "@/features/payment-audit-log/hooks/usePaymentAuditLogs";
// import type { PaymentAuditLog } from "@/features/payment-audit-log";

// const ACTION_LABELS: Record<string, { label: string; className: string }> = {
//   CREATE: {
//     label: "Création",
//     className: "bg-emerald-500/15 text-emerald-600",
//   },
//   UPDATE: {
//     label: "Modification",
//     className: "bg-amber-500/15 text-amber-600",
//   },
//   DELETE: {
//     label: "Suppression",
//     className: "bg-destructive/15 text-destructive",
//   },
// };

// export const DashboardRecentActivity = () => {
//   const { data, isLoading } = usePaymentAuditLogs({
//     page: 1,
//     limit: 10,
//     sortBy: "createdAt",
//     sortOrder: "desc",
//   });

//   return (
//     <section>
//       <div className="flex items-center justify-between mb-3">
//         <h2 className="text-sm font-semibold text-muted-foreground">
//           Dernières activités
//         </h2>
//         <Link
//           to="/payment-audit-logs"
//           className="text-xs text-primary hover:underline"
//         >
//           Voir tout →
//         </Link>
//       </div>
//       <div className="rounded-xl border bg-card overflow-hidden">
//         {isLoading ? (
//           <div className="p-4 space-y-2">
//             {Array.from({ length: 5 }).map((_, i) => (
//               <div key={i} className="h-9 animate-pulse rounded-md bg-muted" />
//             ))}
//           </div>
//         ) : !data?.data.length ? (
//           <p className="p-4 text-sm text-muted-foreground">
//             Aucune activité récente.
//           </p>
//         ) : (
//           <table className="w-full text-sm">
//             <thead className=" text-xs text-muted-foreground">
//               <tr>
//                 <th className="text-left px-4 py-2 font-medium">Date</th>
//                 <th className="text-left px-4 py-2 font-medium">Utilisateur</th>
//                 <th className="text-left px-4 py-2 font-medium">Action</th>
//                 <th className="text-left px-4 py-2 font-medium">Facture</th>
//                 <th className="text-right px-4 py-2 font-medium">Montant</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.data.map((log: PaymentAuditLog) => {
//                 const config = ACTION_LABELS[log.action];
//                 const snapshot = (log.newData ?? log.oldData) as {
//                   invoice?: { number?: string };
//                   amount?: number;
//                 } | null;
//                 return (
//                   <tr key={log.id} className="border-t bg-background">
//                     <td className="px-4 py-2 whitespace-nowrap text-xs">
//                       {new Date(log.createdAt).toLocaleString("fr-FR", {
//                         day: "2-digit",
//                         month: "2-digit",
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </td>
//                     <td className="px-4 py-2">
//                       {log.user.firstName} {log.user.lastName}
//                     </td>
//                     <td className="px-4 py-2">
//                       <Badge
//                         variant="secondary"
//                         className={`text-[10px] px-2 py-0.5 ${config?.className ?? ""}`}
//                       >
//                         {config?.label ?? log.action}
//                       </Badge>
//                     </td>
//                     <td className="px-4 py-2 font-mono text-xs">
//                       {snapshot?.invoice?.number ?? "—"}
//                     </td>
//                     <td className="px-4 py-2 text-right font-medium">
//                       {snapshot?.amount
//                         ? `${snapshot.amount.toLocaleString("fr-FR")} Ar`
//                         : "—"}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </section>
//   );
// };
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePaymentAuditLogs } from "@/features/payment-audit-log/hooks/usePaymentAuditLogs";
import type { PaymentAuditLog } from "@/features/payment-audit-log";

const ACTION_LABELS: Record<string, { label: string; dot: string }> = {
  CREATE: { label: "Création", dot: "bg-success" },
  UPDATE: { label: "Modification", dot: "bg-warning" },
  DELETE: { label: "Suppression", dot: "bg-destructive" },
};

const getInitials = (firstName?: string | null, lastName?: string | null) =>
  `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

export const DashboardRecentActivity = () => {
  const { data, isLoading } = usePaymentAuditLogs({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Dernières activités</h2>
        <Link
          to="/payment-audit-logs"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Voir tout
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        ) : !data?.data.length ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            Aucune activité récente.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-xs text-muted-foreground">
                  <th className="px-4 py-2.5 text-left font-medium">Date</th>
                  <th className="px-4 py-2.5 text-left font-medium">
                    Utilisateur
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium">Action</th>
                  <th className="px-4 py-2.5 text-left font-medium">Facture</th>
                  <th className="px-4 py-2.5 text-right font-medium">
                    Montant
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.data.map((log: PaymentAuditLog) => {
                  const config = ACTION_LABELS[log.action];
                  const isDeleted = log.action === "DELETE";
                  const snapshot = (log.newData ?? log.oldData) as {
                    invoice?: { number?: string };
                    amount?: number;
                  } | null;

                  return (
                    <tr
                      key={log.id}
                      className="transition-colors hover:bg-muted/40"
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-xs tabular-nums text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
                            {getInitials(log.user.firstName, log.user.lastName)}
                          </span>
                          <span className="whitespace-nowrap">
                            {log.user.firstName} {log.user.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className="gap-1.5 px-2 py-0.5 text-xs font-normal"
                        >
                          <span
                            className={`size-1.5 rounded-full ${config?.dot ?? "bg-muted-foreground"}`}
                          />
                          {config?.label ?? log.action}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {snapshot?.invoice?.number ?? "—"}
                      </td>
                      <td
                        className={`whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums ${
                          isDeleted ? "text-muted-foreground line-through" : ""
                        }`}
                      >
                        {snapshot?.amount != null
                          ? `${snapshot.amount.toLocaleString("fr-FR")} Ar`
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};
