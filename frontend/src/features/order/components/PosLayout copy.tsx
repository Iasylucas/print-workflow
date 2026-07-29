import { useState, useCallback } from "react";
import { AmalgamM2Block } from "./AmalgamM2Block";
import { PriceCalculationBlock } from "./PriceCalculationBlock";
import { PosCart } from "./PosCart";
import { useOrderMutations } from "../hooks/useOrders";
import type { PosCartLine, CreateBulkOrderRequest } from "../types/order.types";
import { FolderOpen, LayoutDashboard } from "lucide-react";
import { AmalgamA4Block } from "./AmalgamA4Block";
// 1. Ajoutez l'importation de votre hook en haut de PosLayout.tsx :
import { useProductsCatalog } from "../hooks/useOrders";
import { useClients } from "../hooks/useClient";
import { InvoiceSearchModal } from "./InvoiceSearchModal";
import { useInvoiceMutations } from "@/features/invoices/hooks/useInvoices";
import { Button } from "@/components/ui/button";

export const PosLayout = () => {
  // PosLayout.tsx
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [deposit, setDeposit] = useState<number>(0);
  const [documentType, setDocumentType] = useState<"INVOICE" | "QUOTE">(
    "INVOICE",
  );
  const [deliveryPlace, setDeliveryPlace] = useState<string>("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("CASH");

  // 1. État local du panier (Tableau des lignes de commande de fabrication)
  const [cartLines, setCartLines] = useState<PosCartLine[]>([]);
  const { data: clientsData, isLoading: clientsLoading } = useClients();
  const clients = clientsData?.data || [];
  // second copy
  const [amalgamM2Data, setAmalgamM2Data] = useState<any | null>(null);
  const [triggerResetAmalgam, setTriggerResetAmalgam] =
    useState<boolean>(false);

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState<number | null>(null);

  const handleLoadInvoice = (invoice: any) => {
    // Remplir le panier
    const lines = invoice.orders.map((order: any) => ({
      designation: order.designation,
      productId: order.productId,
      dimensions: order.dimensions,
      label: order.label,
      quantity: order.quantity,
      unitPrice: order.unitPrice,
      atelierNote: order.notes?.[0]?.text || "",
    }));
    setCartLines(lines);

    // Remplir les infos de la facture
    setSelectedClientId(invoice.clientId);
    setDeposit(invoice.deposit);
    setDeliveryPlace(invoice.deliveryPlace || "");
    setExpectedDeliveryDate(
      invoice.expectedDeliveryDate
        ? new Date(invoice.expectedDeliveryDate).toISOString().split("T")[0]
        : "",
    );

    setIsEditing(true);
    setEditingInvoiceId(invoice.id);
    setIsInvoiceModalOpen(false);
  };

  const handleRequestReset = () => {
    setTriggerResetAmalgam(true);
    setAmalgamM2Data(null);
  };

  const handleResetProcessed = () => {
    setTriggerResetAmalgam(false);
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
  // 2. À l'intérieur du composant PosLayout, juste au-dessus de vos états, appelez le hook :
  const { data: catalogData, isLoading: isCatalogLoading } =
    useProductsCatalog();

  // État de liaison pour transférer les calculs du Bloc 1 vers le Bloc 3
  //   const [amalgamM2Data, setAmalgamM2Data] = useState<{
  //     totalPerM2: number;
  //     requiredDimensionM: number;
  //     quantityWanted: number;
  //   } | null>(null);

  // 2. Callback de nettoyage pour vider la caisse après un achat validé avec succès
  const clearCart = useCallback(() => {
    setCartLines([]);
    setSelectedClientId("");
    setDeposit(0);
    setDeliveryPlace("");
    setExpectedDeliveryDate("");
    setPaymentMethod("CASH");
    setAmalgamM2Data(null);
  }, []);

  // 3. Récupération de la mutation réseau TanStack Query
  const { createBulkOrderMutation } = useOrderMutations(clearCart);

  // Actionneur de réception : Ajoute une ligne calculée à gauche dans le panier à droite
  const handleAddLine = (newLine: {
    designation: "";
    productId: null;
    dimensions: "";
    label: "";
    quantity: 1;
    unitPrice: 0;
    atelierNote: "";
  }) => {
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
  };

  // Actionneur de suppression d'une ligne du panier
  const handleRemoveLine = (indexToRemove: number) => {
    setCartLines((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // 4. Soumission finale et sécurisée de la payload vers l'API Backend
  const handleValidateOrder = (summary: {
    documentType: "INVOICE" | "QUOTE";
    deposit: number;
    clientId: string;
    deliveryPlace?: string | null;
    expectedDeliveryDate?: string | null;
    paymentMethod?: string;
  }) => {
    const payload: CreateBulkOrderRequest = {
      clientId: summary.clientId,
      documentType: summary.documentType,
      deposit: summary.deposit,
      deliveryPlace: summary.deliveryPlace || null,
      expectedDeliveryDate: summary.expectedDeliveryDate || null,
      paymentMethod: summary.paymentMethod || "CASH",
      lines: cartLines,
    };

    createBulkOrderMutation.mutate(payload);
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300 font-sans text-xs">
      {/* En-tête du module POS */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5 text-primary stroke-[2.5]" />
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Point de Vente (POS) & Chiffrage
          </h2>
        </div>
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

      {/* 📐 DISPOSITION EN GRILLE SÉPARÉE (60% Calculs / 40% Panier) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start w-full">
        {/* COLONNE GAUCHE (60%): LES BLOCS DE CALCUL INTERCONNECTÉS */}
        <div className="lg:col-span-4 space-y-6 w-full">
          {/* Bloc 1 : Autonome, gère ses lignes et ses cm */}
          <AmalgamM2Block products={catalogData?.data} />
          <AmalgamA4Block products={catalogData?.data} />
          {/* Bloc 3 : Autonome, gère ses mètres et sa facturation manuelle */}
          <PriceCalculationBlock
            // onAddOrderLine={handleAddLine}
            products={catalogData?.data}
          />
        </div>
        {/* COLONNE DROITE (40%): LE PANIER COMPTABLE ET LA SÉLECTION CLIENT */}
        <div className="lg:col-span-6 w-full h-full">
          <PosCart
            cartLines={cartLines}
            clients={clients}
            isLoadingClients={clientsLoading}
            onAddLine={handleAddEmptyLine}
            onRemoveLine={handleRemoveLine}
            onUpdateLine={handleUpdateLine}
            onValidateOrder={handleValidateOrder}
            isSubmitting={createBulkOrderMutation.isPending}
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
          />
        </div>
      </div>
      <InvoiceSearchModal
        isOpen={isInvoiceModalOpen}
        onOpenChange={setIsInvoiceModalOpen}
        onSelectInvoice={handleLoadInvoice}
      />
    </div>
  );
};

// const [selectedClientId, setSelectedClientId] = useState<string>("");
// const [deposit, setDeposit] = useState<number>(0);
// const [documentType, setDocumentType] = useState<"INVOICE" | "QUOTE">(
//   "INVOICE",
// );
// const [deliveryPlace, setDeliveryPlace] = useState<string>("");
// const [expectedDeliveryDate, setExpectedDeliveryDate] = useState<string>("");
// const [paymentMethod, setPaymentMethod] = useState<string>("CASH");

// const [cartLines, setCartLines] = useState<PosCartLine[]>([]);
// const [editingInvoiceLines, setEditingInvoiceLines] = useState<any[]>([]);
// const { data: clientsData, isLoading: clientsLoading } = useClients();
// const clients = clientsData?.data || [];
// const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
// const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
// const [isEditing, setIsEditing] = useState(false);
// const [editingInvoiceId, setEditingInvoiceId] = useState<number | null>(null);
// const [loadingInvoiceId, setLoadingInvoiceId] = useState<number | null>(null);
// const [newPaymentAmount, setNewPaymentAmount] = useState<number>(0);
// const [showNewOrderWarning, setShowNewOrderWarning] = useState(false);
// const [confirmationState, setConfirmationState] = useState<ConfirmationState>(
//   {
//     isOpen: false,
//     title: "",
//     description: "",
//     onConfirm: () => {},
//     isDestructive: false,
//   },
// );

// const { data: orderDetail, isLoading: isLoadingOrder } =
//   useInvoiceForPos(loadingInvoiceId);

// const { data: catalogData, isLoading: isCatalogLoading } =
//   useProductsCatalog();

// const { data: paymentsData, refetch: refetchPayments } = useInvoicePayments(
//   isEditing ? editingInvoiceId : null,
// );
// const clearCart = useCallback(() => {
//   console.log("clear called");

//   setCartLines([]);
//   setEditingInvoiceLines([]);
//   setSelectedClientId("");
//   setDeposit(0);
//   setDeliveryPlace("");
//   setExpectedDeliveryDate("");
//   setPaymentMethod("CASH");
//   // setAmalgamM2Data(null);
//   setIsEditing(false);
//   setEditingInvoiceId(null);
//   setLoadingInvoiceId(null);
//   setNewPaymentAmount(0);
// }, []);

// // Après clearCart, ajoute ces fonctions :

// const handleNewOrder = useCallback(() => {
//   // Vérifier si le panier est vide ou si on est en mode édition
//   if (cartLines.length > 0 || isEditing) {
//     // Demander confirmation
//     setConfirmationState({
//       isOpen: true,
//       title: "Nouvelle commande",
//       description:
//         "Voulez-vous vraiment commencer une nouvelle commande ? Les modifications en cours seront perdues.",
//       onConfirm: () => {
//         console.log("onConfirm called");
//         clearCart();
//         setHasUnsavedChanges(false);
//         // Fermer le modal
//         setConfirmationState((prev) => ({ ...prev, isOpen: false }));
//       },
//       isDestructive: false,
//     });
//     {
//       return;
//     }
//   }
//   clearCart();
//   setHasUnsavedChanges(false);
// }, [cartLines.length, isEditing, clearCart]);

// const handleCancelEdit = useCallback(() => {
//   if (editingInvoiceId) {
//     // Recharger la facture pour annuler les modifications
//     setLoadingInvoiceId(editingInvoiceId);
//     setHasUnsavedChanges(false);
//   }
// }, [editingInvoiceId]);

// const { createBulkOrderMutation, updateOrderFromPosMutation } =
//   useOrderMutations();
// const { addPaymentMutation, deletePaymentMutation } = useInvoiceMutations();

// const handleDeletePayment = (paymentId: number) => {
//   setConfirmationState({
//     isOpen: true,
//     title: "Supprimer le paiement ?",
//     description: "Cette action est irréversible.",
//     isDestructive: true,
//     onConfirm: () => {
//       deletePaymentMutation.mutate(paymentId, {
//         onSuccess: () => {
//           refetchPayments();
//           setConfirmationState({
//             isOpen: false,
//             title: "",
//             description: "",
//             onConfirm: () => {},
//             isDestructive: false,
//           });
//         },
//       });
//     },
//   });
// };

// useEffect(() => {
//   console.log("orderDetail:", orderDetail);
//   console.log("loadingInvoiceId:", loadingInvoiceId);
//   if (!orderDetail || !loadingInvoiceId) return;

//   const lines = orderDetail.orders.map((order: any) => ({
//     id: order.id,
//     designation: order.designation,
//     productId: order.product?.id || null,
//     dimensions: order.dimensions,
//     label: order.label,
//     quantity: order.quantity,
//     unitPrice: order.unitPrice,
//     atelierNote: order.notes?.[0]?.text || "",
//   }));

//   setCartLines(lines);
//   setEditingInvoiceLines(lines);
//   setSelectedClientId(orderDetail.clientId);
//   setDeposit(orderDetail.deposit);
//   setDeliveryPlace(orderDetail.deliveryPlace || "");
//   setExpectedDeliveryDate(
//     orderDetail.expectedDeliveryDate
//       ? new Date(orderDetail.expectedDeliveryDate).toISOString().split("T")[0]
//       : "",
//   );
//   setIsEditing(true);
//   setEditingInvoiceId(orderDetail.id);
//   setLoadingInvoiceId(null);
// }, [orderDetail, loadingInvoiceId]);

// const handleLoadInvoice = (invoice: any) => {
//   setLoadingInvoiceId(invoice.id);
//   setIsInvoiceModalOpen(false);
// };

// const handleRequestReset = () => {
//   setTriggerResetAmalgam(true);
//   // setAmalgamM2Data(null);
// };

// const handleResetProcessed = () => {
//   setTriggerResetAmalgam(false);
// };

// const handleAddEmptyLine = () => {
//   const newLine: PosCartLine = {
//     designation: "",
//     productId: null,
//     dimensions: "",
//     label: "",
//     quantity: 1,
//     unitPrice: 0,
//     atelierNote: "",
//   };
//   setCartLines((prev) => [...prev, newLine]);
// };

// const handleUpdateLine = (
//   index: number,
//   field: keyof PosCartLine,
//   value: any,
// ) => {
//   setCartLines((prev) => {
//     const updated = [...prev];
//     updated[index] = { ...updated[index], [field]: value };
//     return updated;
//   });
//   setHasUnsavedChanges(true);
// };

// const handleRemoveLine = (indexToRemove: number) => {
//   setCartLines((prev) => prev.filter((_, idx) => idx !== indexToRemove));
// };

// const payments = paymentsData?.payments || [];

// const handleAddPayment = async () => {
//   if (!editingInvoiceId || !newPaymentAmount || newPaymentAmount <= 0) return;

//   await addPaymentMutation.mutateAsync({
//     id: editingInvoiceId,
//     data: {
//       amount: newPaymentAmount,
//       method: paymentMethod,
//     },
//   });

//   refetchPayments();
//   setNewPaymentAmount(0);
// };

// const handleValidateOrder = (summary: any) => {
//   const lines = cartLines.map((line, index) => ({
//     orderId: isEditing ? (editingInvoiceLines[index]?.id ?? null) : undefined,
//     designation: line.designation,
//     productId: line.productId,
//     dimensions: line.dimensions,
//     label: line.label,
//     quantity: line.quantity,
//     unitPrice: line.unitPrice,
//     atelierNote: line.atelierNote,
//   }));

//   const payload = {
//     clientId: summary.clientId,
//     documentType: summary.documentType,
//     deposit: isEditing ? 0 : summary.deposit,
//     deliveryPlace: summary.deliveryPlace || null,
//     expectedDeliveryDate: summary.expectedDeliveryDate || null,
//     paymentMethod: summary.paymentMethod || "CASH",
//     lines,
//   };

//   if (isEditing && editingInvoiceId) {
//     updateOrderFromPosMutation.mutate(
//       {
//         invoiceId: editingInvoiceId,
//         data: payload,
//       },
//       {
//         onSuccess: () => {
//           setHasUnsavedChanges(false); // ← Ajouter
//         },
//       },
//     );
//   } else {
//     createBulkOrderMutation.mutate(payload, {
//       onSuccess: () => {
//         clearCart(); // ← SEULEMENT ici
//         setHasUnsavedChanges(false);
//       },
//     });
//   }
// };
