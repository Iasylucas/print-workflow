// frontend/src/features/quotes/components/QuoteDetailDrawer.tsx
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
import { X, Package, Eye, FileText } from "lucide-react";
import { QuoteStatusBadge } from "./QuoteStatusBadge";
import { useQuoteDetail, useQuoteMutations } from "../hooks/useQuotes";
import type { QuoteDetail } from "../types/quotes.types";

interface QuoteDetailDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  quoteId: number | null;
  onConvert?: (quote: QuoteDetail) => void;
}

export const QuoteDetailDrawer = ({
  isOpen,
  onOpenChange,
  quoteId,
  onConvert,
}: QuoteDetailDrawerProps) => {
  const { data: quote, isLoading, refetch } = useQuoteDetail(quoteId);
  const { convertToInvoiceMutation } = useQuoteMutations();

  const [ordersModalOpen, setOrdersModalOpen] = useState(false);

  if (!quoteId) return null;
  if (!quote) return null;

  const handleConvert = async () => {
    if (!quote || quote.status === "converted") return;

    await convertToInvoiceMutation.mutateAsync(quote.id);
    refetch();
    onConvert?.(quote);
  };

  return (
    <>
      <Drawer
        open={isOpen}
        onOpenChange={(open) => {
          if (!open && ordersModalOpen) return;
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
                  Détail du devis
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 shrink-0 justify-self-end"
              >
                <X className="h-4 w-4" />
              </Button>
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
            ) : quote ? (
              <div className="space-y-6">
                {/* Informations principales */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Numéro
                    </p>
                    <p className="font-mono">{quote.number}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Client
                    </p>
                    <p>
                      {quote.client.firstName} {quote.client.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Créé le
                    </p>
                    <p>{new Date(quote.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Statut
                    </p>
                    <QuoteStatusBadge status={quote.status} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total
                    </p>
                    <p className="font-bold">
                      {quote.total.toLocaleString()} Ar
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex gap-2">
                  {quote.status !== "converted" && (
                    <Button
                      onClick={handleConvert}
                      className="flex-1 gap-2"
                      disabled={convertToInvoiceMutation.isPending}
                    >
                      <FileText className="h-4 w-4" />
                      {convertToInvoiceMutation.isPending
                        ? "Conversion..."
                        : "Convertir en facture"}
                    </Button>
                  )}
                  {quote.status === "converted" && (
                    <Badge variant="default" className="text-sm py-2 px-4">
                      Déjà converti
                    </Badge>
                  )}
                </div>

                <Separator />

                {/* Commandes liées */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">
                      Commandes ({quote.orders.length})
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
                  {quote.orders.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Aucune commande
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                      {quote.orders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-muted/20 p-3 rounded-lg flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-2 min-w-0 overflow-x-auto flex-1">
                            <Package className="h-4 w-4 text-muted-foreground shrink-0" />
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
                Devis introuvable
              </div>
            )}
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      {/* Modal pour voir toutes les commandes */}
      <Dialog
        open={ordersModalOpen}
        onOpenChange={setOrdersModalOpen}
        modal={false}
      >
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Commandes du devis {quote?.number}</DialogTitle>
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
                {quote?.orders.map((order) => (
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
          {quote && (
            <div className="flex justify-end border-t border-border pt-3 mt-2">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total devis</p>
                <p className="font-bold">{quote.total.toLocaleString()} Ar</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
