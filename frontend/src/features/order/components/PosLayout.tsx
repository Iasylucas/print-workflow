import { useState, useCallback, useEffect } from "react";
import { AmalgamM2Block } from "./AmalgamM2Block";
import { PriceCalculationBlock } from "./PriceCalculationBlock";
import { PosCart } from "./PosCart";
import { useInvoicePayments, useOrderMutations } from "../hooks/useOrders";
import type { PosCartLine, CreateBulkOrderRequest } from "../types/order.types";
import { FolderOpen, LayoutDashboard, Plus, X } from "lucide-react";
import { AmalgamA4Block } from "./AmalgamA4Block";
import { useProductsCatalog } from "../hooks/useOrders";
import { useClients } from "../hooks/useClient";
import { InvoiceSearchModal } from "./InvoiceSearchModal";
import { useInvoiceMutations } from "@/features/invoices/hooks/useInvoices";
import { Button } from "@/components/ui/button";
import { useInvoiceForPos } from "../hooks/useOrders";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import type { ConfirmationState } from "@/components/shared/ConfirmationDialog";
import { AlertDialog } from "@/components/ui/alert-dialog";

export const PosLayout = () => {
  // --- IDENTIFIANTS ET ÉTATS DE NAVIGATION ---
  const [isEditing, setIsEditing] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState<number | null>(null);
  const [loadingInvoiceId, setLoadingInvoiceId] = useState<number | null>(null);

  // ✅ CLÉ UNIVERSELLE : Détermine l'ID de facture actif pour React Query
  // Empêche la requête de retomber à 0 pendant l'édition
  const currentInvoiceId = loadingInvoiceId || editingInvoiceId;

  // --- REQUÊTES TANSTACK QUERY ---
  const { data: orderDetail, isLoading: isLoadingOrder } =
    useInvoiceForPos(currentInvoiceId);
  const { data: clientsData, isLoading: clientsLoading } = useClients();
  const { data: catalogData, isLoading: isCatalogLoading } =
    useProductsCatalog();
  const { data: paymentsData, refetch: refetchPayments } = useInvoicePayments(
    isEditing ? editingInvoiceId : null,
  );

  const clients = clientsData?.data || [];
  const payments = paymentsData?.payments || [];

  // --- ÉTATS DU FORMULAIRE ET DU PANIER ---
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [deposit, setDeposit] = useState<number>(0);
  const [documentType, setDocumentType] = useState<"INVOICE" | "QUOTE">(
    "INVOICE",
  );
  const [deliveryPlace, setDeliveryPlace] = useState<string>("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("CASH");
  const [cartLines, setCartLines] = useState<PosCartLine[]>([]);
  const [editingInvoiceLines, setEditingInvoiceLines] = useState<any[]>([]);

  // --- ÉTATS SECONDAIRES ---
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [newPaymentAmount, setNewPaymentAmount] = useState<number>(0);
  const [showNewOrderWarning, setShowNewOrderWarning] = useState(false);
  const [confirmationState, setConfirmationState] = useState<ConfirmationState>(
    {
      isOpen: false,
      title: "",
      description: "",
      onConfirm: () => {},
      isDestructive: false,
    },
  );

  // --- MUTATIONS ---
  const { createBulkOrderMutation, updateOrderFromPosMutation } =
    useOrderMutations();
  const { addPaymentMutation, deletePaymentMutation } = useInvoiceMutations();

  // --- FONCTIONS DE GESTION DU PANIER ---
  const clearCart = useCallback(() => {
    console.log("clear called");
    setCartLines([]);
    setEditingInvoiceLines([]);
    setSelectedClientId("");
    setDeposit(0);
    setDeliveryPlace("");
    setExpectedDeliveryDate("");
    setPaymentMethod("CASH");
    setIsEditing(false);
    setEditingInvoiceId(null);
    setLoadingInvoiceId(null);
    setNewPaymentAmount(0);
  }, []);

  // ✅ NETTOYAGE PROFESSIONNEL : Uniquement deux effets ultra-ciblés
  // Effet 1 : Déclenché STRICTEMENT au moment où l'utilisateur sélectionne une facture à charger
  useEffect(() => {
    if (!orderDetail || !loadingInvoiceId) return;

    const lines = orderDetail.orders.map((order: any) => ({
      id: order.id,
      designation: order.designation,
      productId: order.product?.id || null,
      dimensions: order.dimensions,
      label: order.label,
      quantity: order.quantity,
      unitPrice: order.unitPrice,
      atelierNote: order.notes?.[0]?.text || "",
    }));

    setCartLines(lines);
    setEditingInvoiceLines(lines);
    setSelectedClientId(orderDetail.clientId);
    setDeposit(orderDetail.deposit);
    setDeliveryPlace(orderDetail.deliveryPlace || "");
    setExpectedDeliveryDate(
      orderDetail.expectedDeliveryDate
        ? new Date(orderDetail.expectedDeliveryDate).toISOString().split("T")[0]
        : "",
    );

    setIsEditing(true);
    setEditingInvoiceId(orderDetail.id);
    setLoadingInvoiceId(null); // Bascule la main à editingInvoiceId pour conserver la clé active
  }, [orderDetail, loadingInvoiceId]);

  // Effet 2 : Synchronise le formulaire si le cache React Query est invalidé par la mutation arrière-plan
  useEffect(() => {
    if (!orderDetail || loadingInvoiceId || !isEditing) return;

    console.log(
      "🔄 Cache détecté ou invalidé : Mise à jour synchronisée du Front",
    );

    const freshLines = orderDetail.orders.map((order: any) => ({
      id: order.id,
      designation: order.designation,
      productId: order.product?.id || null,
      dimensions: order.dimensions,
      label: order.label,
      quantity: order.quantity,
      unitPrice: order.unitPrice,
      atelierNote: order.notes?.[0]?.text || "",
    }));

    setCartLines(freshLines);
    setEditingInvoiceLines(freshLines);
  }, [orderDetail, isEditing, loadingInvoiceId]);

  // --- HANDLERS ACTIONS ---
  const handleNewOrder = useCallback(() => {
    if (cartLines.length > 0 || isEditing) {
      setConfirmationState({
        isOpen: true,
        title: "Nouvelle commande",
        description:
          "Voulez-vous vraiment commencer une nouvelle commande ? Les modifications en cours seront perdues.",
        onConfirm: () => {
          clearCart();
          setHasUnsavedChanges(false);
          setConfirmationState((prev) => ({ ...prev, isOpen: false }));
        },
        isDestructive: false,
      });
      return;
    }
    clearCart();
    setHasUnsavedChanges(false);
  }, [cartLines.length, isEditing, clearCart]);

  const handleCancelEdit = useCallback(() => {
    if (editingInvoiceId) {
      setLoadingInvoiceId(editingInvoiceId);
      setHasUnsavedChanges(false);
    }
  }, [editingInvoiceId]);

  const handleLoadInvoice = (invoice: any) => {
    setLoadingInvoiceId(invoice.id);
    setIsInvoiceModalOpen(false);
  };

  const handleAddEmptyLine = () => {
    const newLine: PosCartLine = {
      designation: "",
      productId: null,
      dimensions: "",
      label: "",
      quantity: 1,
      unitPrice: 0,
      atelierNote: "",
    };
    setCartLines((prev) => [...prev, newLine]);
  };

  const handleUpdateLine = (
    index: number,
    field: keyof PosCartLine,
    value: any,
  ) => {
    setCartLines((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    setHasUnsavedChanges(true);
  };

  const handleRemoveLine = (indexToRemove: number) => {
    setCartLines((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleDeletePayment = (paymentId: number) => {
    setConfirmationState({
      isOpen: true,
      title: "Supprimer le paiement ?",
      description: "Cette action est irréversible.",
      isDestructive: true,
      onConfirm: () => {
        deletePaymentMutation.mutate(paymentId, {
          onSuccess: () => {
            refetchPayments();
            setConfirmationState({
              isOpen: false,
              title: "",
              description: "",
              onConfirm: () => {},
              isDestructive: false,
            });
          },
        });
      },
    });
  };

  const handleAddPayment = async () => {
    if (!editingInvoiceId || !newPaymentAmount || newPaymentAmount <= 0) return;

    await addPaymentMutation.mutateAsync({
      id: editingInvoiceId,
      data: {
        amount: newPaymentAmount,
        method: paymentMethod,
      },
    });

    refetchPayments();
    setNewPaymentAmount(0);
  };

  const handleValidateOrder = (summary: any) => {
    const lines = cartLines.map((line, index) => ({
      orderId: isEditing ? (editingInvoiceLines[index]?.id ?? null) : undefined,
      designation: line.designation,
      productId: line.productId,
      dimensions: line.dimensions,
      label: line.label,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      atelierNote: line.atelierNote,
    }));

    const payload = {
      clientId: summary.clientId,
      documentType: summary.documentType,
      deposit: isEditing ? 0 : summary.deposit,
      deliveryPlace: summary.deliveryPlace || null,
      expectedDeliveryDate: summary.expectedDeliveryDate || null,
      paymentMethod: summary.paymentMethod || "CASH",
      lines,
    };

    if (isEditing && editingInvoiceId) {
      updateOrderFromPosMutation.mutate(
        {
          invoiceId: editingInvoiceId,
          data: payload,
        },
        {
          onSuccess: () => {
            setHasUnsavedChanges(false);
          },
        },
      );
    } else {
      createBulkOrderMutation.mutate(payload, {
        onSuccess: () => {
          clearCart();
          setHasUnsavedChanges(false);
        },
      });
    }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300 font-sans text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5 text-primary stroke-[2.5]" />
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Point de Vente (POS) & Chiffrage
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {/* Nouvelle commande - toujours visible */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewOrder}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouvelle commande
          </Button>

          {/* Annuler - visible seulement en mode édition */}
          {isEditing && hasUnsavedChanges && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelEdit}
              className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <X className="h-4 w-4" />
              Annuler les modifications
            </Button>
          )}

          {/* Charger une facture */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsInvoiceModalOpen(true)}
            className="gap-2"
          >
            <FolderOpen className="h-4 w-4" />
            Charger une facture
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start w-full">
        <div className="lg:col-span-4 space-y-6 w-full">
          <AmalgamM2Block products={catalogData?.data} />
          <AmalgamA4Block products={catalogData?.data} />
          <PriceCalculationBlock products={catalogData?.data} />
        </div>
        <div className="lg:col-span-6 w-full h-full">
          <PosCart
            onDeletePayment={handleDeletePayment}
            cartLines={cartLines}
            clients={clients}
            isLoadingClients={clientsLoading}
            onAddLine={handleAddEmptyLine}
            onRemoveLine={handleRemoveLine}
            onUpdateLine={handleUpdateLine}
            onValidateOrder={handleValidateOrder}
            isSubmitting={
              createBulkOrderMutation.isPending ||
              updateOrderFromPosMutation.isPending ||
              addPaymentMutation.isPending
            }
            products={catalogData?.data}
            selectedClientId={selectedClientId}
            setSelectedClientId={setSelectedClientId}
            deposit={deposit}
            setDeposit={setDeposit}
            documentType={documentType}
            setDocumentType={setDocumentType}
            deliveryPlace={deliveryPlace}
            setDeliveryPlace={setDeliveryPlace}
            expectedDeliveryDate={expectedDeliveryDate}
            setExpectedDeliveryDate={setExpectedDeliveryDate}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            onReset={clearCart}
            isEditing={isEditing}
            payments={payments}
            newPaymentAmount={newPaymentAmount}
            setNewPaymentAmount={setNewPaymentAmount}
            onAddPayment={handleAddPayment}
          />
        </div>
      </div>
      <InvoiceSearchModal
        isOpen={isInvoiceModalOpen}
        onOpenChange={setIsInvoiceModalOpen}
        onSelectInvoice={handleLoadInvoice}
      />
      <AlertDialog
        open={confirmationState.isOpen}
        onOpenChange={(open) =>
          setConfirmationState((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <ConfirmationDialog
          state={confirmationState}
          onOpenChange={(open) => {
            console.log("onOpenChange called with:", open);

            setConfirmationState((prev) => ({ ...prev, isOpen: open }));
          }}
        />
      </AlertDialog>
    </div>
  );
};
