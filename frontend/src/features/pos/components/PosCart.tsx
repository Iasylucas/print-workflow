import { useState, useCallback } from "react";
import {
  ShoppingCart,
  Plus,
  X,
  ChevronDown,
  ChevronRight,
  Receipt,
  ReceiptText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientSearchCombobox } from "./ClientSearchCombobox";
import type {
  payments,
  PosCartLine,
  PosFormState,
  Product,
} from "../types/pos.types";
import { cn } from "@/lib/utils";

interface PosCartProps {
  formState: PosFormState;
  products: Product[];
  isLoadingClients: boolean;
  isEditing: boolean;
  payments: payments[];
  isSubmitting: boolean;
  isValid: boolean;
  subTotal: number;
  remaining: number;
  totalPayments: number;
  remainingAfterPayments: number;
  newPaymentAmount: number;
  hasUnsavedChanges: boolean;
  onAddLine: () => void;
  onRemoveLine: (index: number) => void;
  onUpdateLine: (
    index: number,
    field: keyof PosCartLine,
    value: PosCartLine[keyof PosCartLine],
  ) => void;
  onUpdateFormField: <K extends keyof PosFormState>(
    field: K,
    value: PosFormState[K],
  ) => void;
  onValidateOrder: (documentType: "INVOICE" | "QUOTE") => void;
  onAddPayment: () => void;
  onDeletePayment: (paymentId: number) => void;
  onSetNewPaymentAmount: (value: number) => void;
  onCancelEdit: () => void;
  onAddClient: () => void;
  isLoadingOrder: boolean;
}

const getLineTotal = (line: PosCartLine) =>
  (line.quantity || 0) * (line.unitPrice || 0);

export const PosCart = ({
  formState,
  products,
  isLoadingClients,
  isEditing,
  payments,
  isSubmitting,
  isValid,
  subTotal,
  remaining,
  totalPayments,
  remainingAfterPayments,
  newPaymentAmount,
  onAddLine,
  onRemoveLine,
  onUpdateLine,
  onUpdateFormField,
  onValidateOrder,
  onAddPayment,
  onDeletePayment,
  onSetNewPaymentAmount,
  onCancelEdit,
  hasUnsavedChanges,
  onAddClient,
  isLoadingOrder,
}: PosCartProps) => {
  // ─── STATE LOCAL (UI uniquement) ───
  const [expandedNotes, setExpandedNotes] = useState<number[]>([]);

  const toggleNote = useCallback((index: number) => {
    setExpandedNotes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  }, []);

  // ─── HANDLERS ───
  const handleProductChange = useCallback(
    (index: number, val: string) => {
      const product = products.find((p) => p.id === parseInt(val));
      onUpdateLine(index, "productId", product?.id || null);
      if (product) onUpdateLine(index, "designation", product.name);
    },
    [products, onUpdateLine],
  );

  const handleValidate = useCallback(
    (type: "INVOICE" | "QUOTE") => {
      if (!isValid) return;
      onValidateOrder(type);
    },
    [isValid, onValidateOrder],
  );

  // ─── RENDER ───
  return (
    <div className="rounded-xl border border-border bg-background p-4 shadow-sm h-full flex flex-col font-sans text-xs min-h-[500px]">
      {/* EN-TÊTE */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 text-primary stroke-[2.5]" />
          <h3 className="font-bold text-foreground text-sm">Panier</h3>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
            {formState.cartLines.length}{" "}
            {formState.cartLines.length > 1 ? "lignes" : "ligne"}
          </Badge>
          {isEditing &&
            !isLoadingOrder &&
            (() => {
              const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
              const status =
                totalPaid === 0
                  ? "unpaid"
                  : totalPaid >= subTotal
                    ? "paid"
                    : "partial";

              return (
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 capitalize font-medium",
                    status === "paid" && "bg-emerald-500/15 text-emerald-600",
                    status === "partial" && "bg-amber-500/15 text-amber-600",
                    status === "unpaid" && "bg-destructive/15 text-destructive",
                  )}
                >
                  {status === "paid"
                    ? "Payée"
                    : status === "partial"
                      ? "Partielle"
                      : "Non payée"}
                </Badge>
              );
            })()}
        </div>
        <div className="flex items-center gap-2">
          {isEditing && hasUnsavedChanges && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancelEdit}
              className="h-7 gap-1 text-[10px] font-medium text-muted-foreground hover:text-destructive"
            >
              <X size={13} />
              Annuler
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onAddLine}
            className="h-7 gap-1 text-[10px] font-medium"
          >
            <Plus size={13} />
            Ajouter ligne
          </Button>
        </div>
      </div>

      {/* CLIENT + TYPE */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-[11px] font-semibold text-muted-foreground">
            Client
          </Label>
          <div className="flex items-center gap-2">
            <ClientSearchCombobox
              value={formState.selectedClientId}
              onChange={(v) => onUpdateFormField("selectedClientId", v)}
              disabled={isLoadingClients}
              placeholder={
                isLoadingClients ? "Chargement..." : "Sélectionner un client..."
              }
            />
            <Button
              variant="outline"
              size="icon"
              onClick={onAddClient}
              className="h-8 w-8 flex-shrink-0"
              title="Ajouter un client"
            >
              <Plus size={14} />
            </Button>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px] font-medium text-muted-foreground">
            Livraison (optionnel)
          </Label>
          <Input
            type="text"
            value={formState.deliveryPlace}
            onChange={(e) => onUpdateFormField("deliveryPlace", e.target.value)}
            className="h-8 text-xs"
            placeholder="Adresse"
          />
        </div>
      </div>

      {/* LIVRAISON + DATE */}
      <div className="mt-2 grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-[11px] font-medium text-muted-foreground">
            Date livraison prévue (optionnel)
          </Label>
          <Input
            type="date"
            value={formState.expectedDeliveryDate}
            onChange={(e) =>
              onUpdateFormField("expectedDeliveryDate", e.target.value)
            }
            className="h-8 text-xs"
          />
        </div>
      </div>

      {/* TABLEUR */}
      <div className="mt-4 flex-1 overflow-auto">
        <div className="border border-border rounded-md overflow-hidden">
          <div className="grid grid-cols-12 bg-muted/50 p-2 border-b border-border font-semibold text-muted-foreground text-[10px] uppercase tracking-wider gap-1">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-2">Produit</div>
            <div className="col-span-3">Désignation</div>
            <div className="col-span-1">Dimensions</div>
            <div className="col-span-1">Label</div>
            <div className="col-span-1 text-center">Qté</div>
            <div className="col-span-1 text-right">Prix U.</div>
            <div className="col-span-1 text-right">Total</div>
            <div className="col-span-1 text-center">Actions</div>
          </div>

          {isLoadingOrder ? (
            <div className="space-y-2 p-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="grid grid-cols-12 gap-1">
                  <div className="col-span-1 h-7 bg-muted/50 rounded animate-pulse" />
                  <div className="col-span-2 h-7 bg-muted/50 rounded animate-pulse" />
                  <div className="col-span-2 h-7 bg-muted/50 rounded animate-pulse" />
                  <div className="col-span-2 h-7 bg-muted/50 rounded animate-pulse" />
                  <div className="col-span-1 h-7 bg-muted/50 rounded animate-pulse" />
                  <div className="col-span-1 h-7 bg-muted/50 rounded animate-pulse" />
                  <div className="col-span-1 h-7 bg-muted/50 rounded animate-pulse" />
                  <div className="col-span-1 h-7 bg-muted/50 rounded animate-pulse" />
                  <div className="col-span-1 h-7 bg-muted/50 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : formState.cartLines.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground/60 italic">
              Aucune ligne. Cliquez sur "Ajouter ligne".
            </div>
          ) : (
            formState.cartLines.map((line, index) => {
              const isNoteExpanded = expandedNotes.includes(index);
              const lineTotal = getLineTotal(line);

              return (
                <div key={index}>
                  <div
                    className={`grid grid-cols-12 items-center p-1.5 border-b border-border/60 gap-1 hover:bg-muted/5 transition-colors ${
                      isNoteExpanded ? "bg-muted/10" : ""
                    }`}
                  >
                    <div className="col-span-1 text-center text-muted-foreground text-[10px]">
                      {index + 1}
                    </div>
                    <div className="col-span-2">
                      <Select
                        value={line.productId?.toString() || ""}
                        onValueChange={(v) => handleProductChange(index, v)}
                      >
                        <SelectTrigger className="h-7 text-xs w-full">
                          <SelectValue placeholder="Produit" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem
                              key={product.id}
                              value={product.id.toString()}
                            >
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="text"
                        value={line.designation}
                        onChange={(e) =>
                          onUpdateLine(index, "designation", e.target.value)
                        }
                        className="h-7 text-xs px-1.5"
                        placeholder="Désignation"
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        type="text"
                        value={line.dimensions || ""}
                        onChange={(e) =>
                          onUpdateLine(index, "dimensions", e.target.value)
                        }
                        className="h-7 text-xs px-1.5"
                        placeholder="20x30cm"
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        type="text"
                        value={line.label || ""}
                        onChange={(e) =>
                          onUpdateLine(index, "label", e.target.value)
                        }
                        className="h-7 text-xs px-1.5"
                        placeholder="Étiquette"
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        type="number"
                        min={1}
                        value={line.quantity || 1}
                        onChange={(e) =>
                          onUpdateLine(
                            index,
                            "quantity",
                            parseInt(e.target.value) || 1,
                          )
                        }
                        className="h-7 text-xs text-center px-1"
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        type="number"
                        min={0}
                        value={line.unitPrice || 0}
                        onChange={(e) =>
                          onUpdateLine(
                            index,
                            "unitPrice",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="h-7 text-xs text-right px-1.5 font-medium"
                      />
                    </div>
                    <div className="col-span-1 text-right font-semibold text-foreground">
                      {lineTotal.toLocaleString()} Ar
                    </div>
                    <div className="col-span-1 flex items-center justify-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleNote(index)}
                        className="h-6 w-6 text-muted-foreground/50 hover:text-muted-foreground"
                      >
                        {isNoteExpanded ? (
                          <ChevronDown size={13} />
                        ) : (
                          <ChevronRight size={13} />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveLine(index)}
                        className="h-6 w-6 text-muted-foreground/70 hover:text-destructive hover:bg-destructive/10"
                      >
                        <X size={13} />
                      </Button>
                    </div>
                  </div>

                  {isNoteExpanded && (
                    <div className="grid grid-cols-12 items-start p-1.5 bg-muted/5 border-b border-border/40 gap-1">
                      <div className="col-span-1" />
                      <div className="col-span-10">
                        <Textarea
                          value={line.atelierNote || ""}
                          onChange={(e) =>
                            onUpdateLine(index, "atelierNote", e.target.value)
                          }
                          className="h-16 text-xs px-2 resize-y"
                          placeholder="Note pour l'atelier"
                        />
                      </div>
                      <div className="col-span-1" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* SECTION FINANCIÈRE */}
      <div className="pt-3 mt-3 border-t border-border">
        <div className="space-y-2">
          {/* Sous-total */}
          <div className="flex justify-between items-center py-1 border-b border-dashed border-border/50">
            <span className="font-medium text-muted-foreground">
              Sous-total
            </span>
            {isLoadingOrder ? (
              <div className="h-5 w-32 bg-muted/50 rounded animate-pulse" />
            ) : (
              <span className="font-semibold text-foreground">
                {subTotal.toLocaleString()} Ar
              </span>
            )}
          </div>

          {/* Acompte / Nouveau paiement */}
          {isEditing ? (
            <div className="flex items-center justify-between py-1 border-b border-dashed border-border/50">
              <span className="font-medium text-muted-foreground">
                Nouveau paiement
              </span>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  max={remainingAfterPayments}
                  value={newPaymentAmount || ""}
                  onChange={(e) =>
                    onSetNewPaymentAmount(Number(e.target.value))
                  }
                  className="h-7 w-32 text-xs text-right font-semibold"
                  placeholder="0"
                />
                <Button
                  size="sm"
                  onClick={onAddPayment}
                  disabled={
                    !newPaymentAmount || newPaymentAmount <= 0 || isSubmitting
                  }
                  className="h-7 text-xs"
                >
                  Ajouter
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center py-1 border-b border-dashed border-border/50">
              <span className="font-medium text-muted-foreground">
                Acompte versé
              </span>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  max={subTotal}
                  value={formState.deposit || ""}
                  onChange={(e) =>
                    onUpdateFormField("deposit", Number(e.target.value))
                  }
                  className="h-7 w-32 text-xs text-right font-semibold"
                  placeholder="0"
                />
                <span className="text-xs text-muted-foreground">Ar</span>
              </div>
            </div>
          )}

          {/* Reste à payer */}
          <div className="flex justify-between items-center py-2">
            <span className="font-bold text-foreground text-sm">
              Reste à payer
            </span>
            {isLoadingOrder ? (
              <div className="h-6 w-40 bg-muted/50 rounded animate-pulse" />
            ) : (
              <span className="text-lg font-black text-primary">
                {isEditing
                  ? remainingAfterPayments.toLocaleString()
                  : isNaN(remaining)
                    ? "0"
                    : remaining.toLocaleString()}{" "}
                Ar
              </span>
            )}
          </div>

          {/* Historique paiements */}
          {isEditing && (
            <div className="mt-2 p-2 bg-muted/20 rounded-md">
              <p className="text-xs font-semibold text-muted-foreground">
                Historique des paiements
              </p>
              {isLoadingOrder ? (
                <div className="space-y-2 mt-1">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <div className="h-4 w-20 bg-muted/50 rounded animate-pulse" />
                      <div className="h-4 w-16 bg-muted/50 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : payments.length > 0 ? (
                <>
                  <div className="space-y-1 mt-1">
                    {payments.map((p, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-xs items-center gap-2"
                      >
                        <span className="text-muted-foreground w-20 flex-shrink-0">
                          {new Date(p.date).toLocaleDateString()}
                        </span>
                        <span className="text-muted-foreground w-24 flex-shrink-0">
                          {p.method}
                        </span>
                        <span className="flex-1 text-right font-medium">
                          {p.amount.toLocaleString()} Ar
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeletePayment(p.id)}
                          className="h-5 w-5 text-muted-foreground/50 hover:text-destructive flex-shrink-0"
                        >
                          <X size={12} />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                    <span>Total payé</span>
                    <span className="font-semibold">
                      {totalPayments.toLocaleString()} Ar
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-xs text-muted-foreground mt-1">
                  Aucun paiement
                </p>
              )}
            </div>
          )}

          {/* Méthode de paiement */}
          <div className="flex justify-between items-center py-1 border-t border-border pt-2">
            <span className="font-medium text-muted-foreground">
              Mode de paiement
            </span>
            <Select
              value={formState.paymentMethod}
              onValueChange={(v) =>
                onUpdateFormField(
                  "paymentMethod",
                  v as "CASH" | "MOBILE_MONEY" | "BANK_TRANSFER" | "CHECK",
                )
              }
            >
              <SelectTrigger className="h-7 w-40 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">Espèces</SelectItem>
                <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                <SelectItem value="BANK_TRANSFER">Virement bancaire</SelectItem>
                <SelectItem value="CHECK">Chèque</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Boutons validation */}
        <div className="grid grid-cols-2 gap-2 pt-3">
          <Button
            type="button"
            variant="outline"
            disabled={!isValid || isSubmitting}
            onClick={() => handleValidate("QUOTE")}
            className="h-9 font-semibold text-xs border-input bg-background shadow-xs gap-1.5 hover:bg-muted/50"
          >
            <Receipt size={14} /> Devis
          </Button>
          <Button
            type="button"
            disabled={!isValid || isSubmitting}
            onClick={() => handleValidate("INVOICE")}
            className="h-9 font-semibold text-xs shadow-sm gap-1.5 bg-primary hover:bg-primary/90 text-background"
          >
            <ReceiptText size={14} />
            {isEditing ? "Mettre à jour" : "Émettre Facture"}
          </Button>
        </div>

        {!isValid && (
          <p className="text-[10px] text-destructive text-center pt-2">
            Veuillez sélectionner un client et ajouter au moins une ligne.
          </p>
        )}
      </div>
    </div>
  );
};
