import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Trash2, User, ReceiptText, Receipt } from "lucide-react";
import type { PosCartLine } from "../types/order.types";

interface PosCartProps {
  cartLines: PosCartLine[];
  onRemoveLine: (index: number) => void;
  onValidateOrder: (payload: {
    documentType: "INVOICE" | "QUOTE";
    deposit: number;
    clientId: string;
  }) => void;
  isSubmitting: boolean;
}

export const PosCart = ({
  cartLines,
  onRemoveLine,
  onValidateOrder,
  isSubmitting,
}: PosCartProps) => {
  // 💡 Note : Simulé ici avec un ID temporaire fixe, la recherche asynchrone dynamique
  // sera câblée lors de l'assemblage final dans le conteneur principal PosLayout
  const [selectedClientId] = useState<string>("client-id-standard-1");
  const [deposit, setDeposit] = useState<number>(0);

  // Calcul du montant cumulé total en Ariary
  const subTotal = useMemo(() => {
    return cartLines.reduce((acc, line) => acc + line.totalPrice, 0);
  }, [cartLines]);

  const remaining = useMemo(() => {
    const res = subTotal - deposit;
    return res < 0 ? 0 : res;
  }, [subTotal, deposit]);

  return (
    <div className="rounded-xl border border-border bg-background p-4 shadow-sm h-full flex flex-col justify-between font-sans text-xs min-h-[500px]">
      {/* SECTION SUPÉRIEURE : EN-TÊTE DU PANIER */}
      <div className="space-y-4 flex-1">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <ShoppingCart className="h-4 w-4 text-primary stroke-[2.5]" />
          <h3 className="font-bold text-foreground text-sm">
            Panier de Fabrication
          </h3>
          <Badge
            variant="secondary"
            className="ml-auto text-[10px] px-1.5 py-0.5"
          >
            {cartLines.length} {cartLines.length > 1 ? "lignes" : "ligne"}
          </Badge>
        </div>

        {/* Sélection Client (Simulée pour l'instant) */}
        <div className="p-2.5 rounded-lg border border-border bg-muted/30 flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <User size={14} className="stroke-[2.5]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-medium text-muted-foreground">
              Client associé
            </span>
            <span className="font-semibold text-foreground truncate">
              Client Comptoir (Ewa Print)
            </span>
          </div>
        </div>

        {/* LISTE DES LIGNES COMPACTE (Façon POS de caisse) */}
        <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
          {cartLines.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground/60 italic">
              Le panier est vide. Calculez un prix à gauche pour commencer.
            </div>
          ) : (
            cartLines.map((line, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg border border-border/80 bg-background hover:bg-muted/10 transition-colors gap-2"
              >
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-semibold text-foreground truncate">
                    {line.designation}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">
                    {line.unitPrice.toLocaleString()} Ar × {line.quantity}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground whitespace-nowrap">
                    {line.totalPrice.toLocaleString()} Ar
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveLine(index)}
                    className="h-7 w-7 text-muted-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 size={13} className="stroke-[2.2]" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SECTION INFÉRIEURE : TOTAL ET VALIDATION */}
      <div className="pt-4 border-t border-border bg-linear-to-t from-muted/10 to-transparent space-y-4 mt-4">
        {/* Saisie Acompte direct sur le POS */}
        {subTotal > 0 && (
          <div className="space-y-1.5 p-2 rounded-lg bg-muted/40 border border-border/60">
            <Label className="text-[11px] font-medium text-muted-foreground">
              Enregistrer un acompte reçu (Ariary)
            </Label>
            <Input
              type="number"
              min={0}
              max={subTotal}
              value={deposit || ""}
              onChange={(e) => setDeposit(Number(e.target.value))}
              className="h-8 text-xs font-semibold focus-visible:ring-0 text-foreground bg-background"
              placeholder="Ex: 50000"
            />
          </div>
        )}

        {/* Tableau Récapitulatif Comptable */}
        <div className="space-y-1.5 px-1">
          <div className="flex justify-between text-muted-foreground font-medium">
            <span>Sous-Total Général</span>
            <span>{subTotal.toLocaleString()} Ar</span>
          </div>
          <div className="flex justify-between text-muted-foreground font-medium">
            <span>Acompte Versé</span>
            <span className="text-emerald-600 font-semibold">
              -{deposit.toLocaleString()} Ar
            </span>
          </div>
          <div className="flex justify-between items-baseline pt-1.5 border-t border-dashed border-border">
            <span className="font-bold text-foreground text-sm">
              Reste à payer
            </span>
            <span className="text-base font-black text-primary tracking-tight">
              {remaining.toLocaleString()}{" "}
              <span className="text-xs font-bold">Ar</span>
            </span>
          </div>
        </div>

        {/* Boutons de validation à double choix (Facture vs Devis) */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={cartLines.length === 0 || isSubmitting}
            onClick={() =>
              onValidateOrder({
                documentType: "QUOTE",
                deposit: 0,
                clientId: selectedClientId,
              })
            }
            className="h-9 font-semibold text-xs border-input bg-background text-foreground shadow-xs gap-1.5 hover:bg-muted/50"
          >
            <Receipt size={14} className="stroke-[2.2] text-muted-foreground" />
            Générer Devis
          </Button>

          <Button
            type="button"
            disabled={cartLines.length === 0 || isSubmitting}
            onClick={() =>
              onValidateOrder({
                documentType: "INVOICE",
                deposit,
                clientId: selectedClientId,
              })
            }
            className="h-9 font-semibold text-xs shadow-sm gap-1.5 bg-primary hover:bg-primary/90 text-background transition-all"
          >
            <ReceiptText size={14} className="stroke-[2.5]" />
            Émettre Facture
          </Button>
        </div>
      </div>
    </div>
  );
};
