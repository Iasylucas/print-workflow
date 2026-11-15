import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { PaymentAuditLog } from "../types/payment-audit-log.types";

interface PaymentAuditLogDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  log: PaymentAuditLog | null;
}

const actionLabel: Record<PaymentAuditLog["action"], string> = {
  CREATE: "Création",
  UPDATE: "Modification",
  DELETE: "Suppression",
};

const formatAmount = (value: unknown) => {
  if (typeof value !== "number") return "-";
  return `${value.toLocaleString("fr-FR")} Ar`;
};

const formatDate = (value: unknown) => {
  if (typeof value !== "string") return "-";
  return new Date(value).toLocaleString("fr-FR");
};

const getString = (value: unknown) => {
  if (typeof value !== "string" || value.trim() === "") return "-";
  return value;
};

const PaymentDataBlock = ({
  title,
  data,
}: {
  title: string;
  data: Record<string, unknown> | null;
}) => {
  if (!data) return null;

  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        {title}
      </p>
      <div className="grid grid-cols-2 gap-4 bg-muted/20 rounded-xl p-4">
        <div>
          <p className="text-xs text-muted-foreground">Montant</p>
          <p className="text-sm font-medium">{formatAmount(data.amount)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Méthode</p>
          <p className="text-sm">{getString(data.method)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Facture</p>
          <p className="text-sm">
            {(data.invoice as { number?: string } | undefined)?.number || "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Date</p>
          <p className="text-sm">{formatDate(data.date)}</p>
        </div>
      </div>
    </div>
  );
};

export const PaymentAuditLogDetailModal = ({
  isOpen,
  onOpenChange,
  log,
}: PaymentAuditLogDetailModalProps) => {
  if (!log) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détail de l'action</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-sm mt-2">
          {/* Métadonnées de l'action */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p>{new Date(log.createdAt).toLocaleString("fr-FR")}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Utilisateur</p>
              <p>
                {log.user.firstName || ""} {log.user.lastName}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Action</p>
              <Badge variant="secondary">{actionLabel[log.action]}</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Paiement</p>
              <p className="font-mono">{log.invoiceNumber ?? "-"}</p>
            </div>
          </div>

          {log.reason && (
            <div>
              <p className="text-xs text-muted-foreground">Raison</p>
              <p>{log.reason}</p>
            </div>
          )}

          <Separator />

          {/* Ancienne valeur */}
          <PaymentDataBlock title="Ancienne valeur" data={log.oldData} />

          {/* Nouvelle valeur */}
          <PaymentDataBlock title="Nouvelle valeur" data={log.newData} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
