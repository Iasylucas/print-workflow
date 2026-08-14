// frontend/src/features/invoices/components/InvoiceDetailDrawer.tsx
import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  X,
  CreditCard,
  Package,
  Plus,
  Trash2,
  Eye,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";
import { useInvoiceDetail, useInvoiceMutations } from "../hooks/useInvoices";
// import type { InvoiceDetail } from "../types/invoices.types";
import { AddPaymentModal } from "./AddPaymentModal";
import { downloadInvoicePDF } from "@/shared/pdf/InvoicePdf";
// import type { InvoicePaymentStatus } from "../schema/invoices.schema";

interface InvoiceDetailDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: number | null;
}

export const InvoiceDetailDrawer = ({
  isOpen,
  onOpenChange,
  invoiceId,
}: InvoiceDetailDrawerProps) => {
  const { data: invoice, isLoading, refetch } = useInvoiceDetail(invoiceId);
  const {
    // updateInvoiceMutation,
    deletePaymentMutation,
    markDeliveredMutation,
  } = useInvoiceMutations();

  const [addPaymentModalOpen, setAddPaymentModalOpen] = useState(false);
  const [ordersModalOpen, setOrdersModalOpen] = useState(false);

  if (!invoiceId) return null;

  if (!invoice) {
    return null;
  }
  const invoiceRemain = invoice.total - invoice.deposit;
  console.log(invoiceRemain);

  const handleDeliverToggle = async (checked: boolean) => {
    if (!invoice) return;
    if (invoiceRemain > 0 && checked) {
      toast.error(
        "Impossible de marquer livrée : le solde n'est pas entièrement payé.",
      );
      return;
    }
    await markDeliveredMutation.mutateAsync({
      id: invoice.id,
      data: { isDelivered: checked },
    });
    refetch();
  };

  const handleDeletePayment = async (paymentId: number) => {
    if (window.confirm("Supprimer ce paiement ?")) {
      await deletePaymentMutation.mutateAsync(paymentId);
      refetch();
    }
  };

  const handleDownloadPDF = async () => {
    if (!invoiceId) return;
    try {
      await downloadInvoicePDF(invoice, invoice.companyInfo);
    } catch {
      toast.error("Erreur lors de la génération du PDF");
    }
  };

  console.log(invoice);

  return (
    <>
      <Drawer
        open={isOpen}
        onOpenChange={(open) => {
          if (!open && (addPaymentModalOpen || ordersModalOpen)) {
            return;
          }
          onOpenChange(open);
        }}
        direction="right"
        handleOnly={true}
      >
        <DrawerContent className="w-[500px] max-w-full h-full rounded-none overflow-hidden">
          <DrawerHeader className="border-b px-4 py-3">
            <div className="grid grid-cols-[1fr_auto] items-center gap-2">
              <div className="flex flex-col min-w-0">
                <span className="text-lg font-semibold truncate">
                  Détail de la facture
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDownloadPDF}
                  className="h-8 w-8 shrink-0"
                  title="Télécharger PDF"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  className="h-8 w-8 shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DrawerHeader>

          <ScrollArea className="flex-1 h-[calc(100vh-80px)] p-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : invoice ? (
              <div className="space-y-6">
                {/* Informations principales */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Numéro
                    </p>
                    <p className="font-mono">{invoice.number}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Client
                    </p>
                    <p>
                      {invoice.client.firstName} {invoice.client.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Créée le
                    </p>
                    <p>{new Date(invoice.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Numéro du client
                    </p>
                    <p>{invoice.client.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Lieu de livraison
                    </p>
                    <p>{invoice.deliveryPlace ? invoice.deliveryPlace : "_"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Statut paiement
                    </p>
                    <InvoiceStatusBadge status={invoice.paymentStatus} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="delivered-toggle"
                      className="text-sm font-medium text-muted-foreground"
                    >
                      Livrée
                    </Label>
                    <Switch
                      id="delivered-toggle"
                      checked={invoice.isDelivered}
                      onCheckedChange={handleDeliverToggle}
                      disabled={invoiceRemain > 0}
                    />
                  </div>
                </div>

                <Separator />

                {/* Finances */}
                <div>
                  <h3 className="font-semibold mb-2">Finances</h3>
                  <div className="grid grid-cols-3 gap-4 p-3 rounded-lg bg-muted/20">
                    <div>
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="font-bold text-sm">
                        {invoice.total.toLocaleString()} Ar
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Acompte</p>
                      <p className="font-bold text-sm text-emerald-500">
                        {invoice.deposit.toLocaleString()} Ar
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Reste</p>
                      <p className="font-bold text-sm text-destructive">
                        {invoiceRemain.toLocaleString()} Ar
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Paiements */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">
                      Paiements ({invoice.payments.length})
                    </h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setAddPaymentModalOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>
                  {invoice.payments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Aucun paiement
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                      {invoice.payments.map((payment) => (
                        <div
                          key={payment.id}
                          className="bg-muted/20 p-3 rounded-lg flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-2 min-w-0 min-w-0 flex-1">
                            <CreditCard className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="shrink-0">
                              {payment.amount.toLocaleString()} Ar
                            </span>
                            <Badge
                              variant="outline"
                              className="text-xs shrink-0"
                            >
                              {payment.method === "CASH"
                                ? "Espèces"
                                : payment.method === "MOBILE_MONEY"
                                  ? "Mobile Money"
                                  : payment.method === "BANK_TRANSFER"
                                    ? "Virement"
                                    : "Chèque"}
                            </Badge>
                            <span className="text-xs text-muted-foreground truncate">
                              {new Date(payment.date).toLocaleDateString()}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDeletePayment(payment.id)}
                            className="text-muted-foreground/50 hover:text-destructive transition-colors shrink-0 ml-2"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Commandes liées */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">
                      Commandes ({invoice.orders.length})
                    </h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setOrdersModalOpen(true)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Voir tout
                    </Button>
                  </div>
                  {invoice.orders.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Aucune commande
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                      {invoice.orders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-muted/20 p-3 rounded-lg flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-2 min-w-0 overflow-x-auto flex-1">
                            <Package className="h-4 w-4 text-muted-foreground shrink-0" />
                            {/* <span className="font-mono text-xs shrink-0">
                              {order.reference}
                            </span> */}
                            <span className="truncate max-w-[120px]">
                              {order.designation}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs shrink-0">
                            {order.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Separator />
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                Facture introuvable
              </div>
            )}
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      <AddPaymentModal
        isOpen={addPaymentModalOpen}
        onOpenChange={setAddPaymentModalOpen}
        invoice={invoice}
      />

      {/* Modal pour voir toutes les commandes */}
      {/* Modal pour voir toutes les commandes */}
      <Dialog
        open={ordersModalOpen}
        onOpenChange={setOrdersModalOpen}
        modal={false}
      >
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Commandes de la facture {invoice?.number}</DialogTitle>
          </DialogHeader>

          {/* Tableau des commandes */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="text-left py-2 px-3 font-medium">Référence</th>
                  <th className="text-left py-2 px-3 font-medium">
                    Désignation
                  </th>
                  <th className="text-right py-2 px-3 font-medium">Qté</th>
                  <th className="text-right py-2 px-3 font-medium">Prix U.</th>
                  <th className="text-right py-2 px-3 font-medium">Total</th>
                  <th className="text-left py-2 px-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {invoice?.orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border/60 hover:bg-muted/20"
                  >
                    <td className="py-2 px-3 font-mono text-xs">
                      {order.reference}
                    </td>
                    <td className="py-2 px-3">{order.designation}</td>
                    <td className="py-2 px-3 text-right">{order.quantity}</td>
                    <td className="py-2 px-3 text-right">
                      {order.unitPrice.toLocaleString()} Ar
                    </td>
                    <td className="py-2 px-3 text-right font-semibold">
                      {(order.unitPrice * order.quantity).toLocaleString()} Ar
                    </td>
                    <td className="py-2 px-3">
                      <Badge variant="outline" className="text-xs">
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total général */}
          {invoice && (
            <div className="flex justify-end border-t border-border pt-3 mt-2">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total facture</p>
                <p className="font-bold">{invoice.total.toLocaleString()} Ar</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
