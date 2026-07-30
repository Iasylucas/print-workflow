import { useState, useCallback, useMemo, useRef } from "react";
import { useProductsCatalog } from "../hooks/useOrders";
import { useClients } from "../hooks/useClient";
import { useInvoiceForPos } from "../hooks/useOrders";
import { useOrderMutations, useInvoicePayments } from "../hooks/useOrders";
import { useInvoiceMutations } from "@/features/invoices/hooks/useInvoices";

export interface PosCartLine {
  id?: number;
  designation: string;
  productId: number | null;
  dimensions: string;
  label: string;
  quantity: number;
  unitPrice: number;
  atelierNote: string;
}

export interface PosFormState {
  selectedClientId: string;
  deposit: number;
  documentType: "INVOICE" | "QUOTE";
  deliveryPlace: string;
  expectedDeliveryDate: string;
  paymentMethod: string;
  cartLines: PosCartLine[];
}

export type PendingAction =
  | { type: "newOrder" }
  | { type: "cancelEdit" }
  | { type: "deletePayment"; paymentId: number };

export const usePosCart = () => {
  // ─── MODE / NAVIGATION ───
  const [isEditing, setIsEditing] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState<number | null>(null);
  const [loadingInvoiceId, setLoadingInvoiceId] = useState<number | null>(null);

  const currentInvoiceId = loadingInvoiceId || editingInvoiceId;

  // ─── DATA TANSTACK ───
  const { data: orderDetail, isLoading: isLoadingOrder } =
    useInvoiceForPos(currentInvoiceId);
  const { data: clientsData, isLoading: clientsLoading } = useClients();
  const { data: catalogData, isLoading: isCatalogLoading } =
    useProductsCatalog();
  const { data: paymentsData, refetch: refetchPayments } = useInvoicePayments(
    isEditing ? editingInvoiceId : null,
  );

  const clients = clientsData?.data || [];
  const products = catalogData?.data || [];
  const payments = paymentsData?.payments || [];

  // ─── FORM STATE (centralisé) ───
  const [formState, setFormState] = useState<PosFormState>({
    selectedClientId: "",
    deposit: 0,
    documentType: "INVOICE",
    deliveryPlace: "",
    expectedDeliveryDate: "",
    paymentMethod: "CASH",
    cartLines: [],
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [newPaymentAmount, setNewPaymentAmount] = useState(0);

  // ─── DIALOG (sans fonction dans le state) ───
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null,
  );
  const confirmActionRef = useRef<(() => void) | null>(null);

  // ─── MUTATIONS ───
  const { createBulkOrderMutation, updateOrderFromPosMutation } =
    useOrderMutations();
  const { addPaymentMutation, deletePaymentMutation } = useInvoiceMutations();

  // ─── DERIVED (mémoïsés) ───
  const subTotal = useMemo(
    () =>
      formState.cartLines.reduce(
        (acc, l) => acc + (l.quantity || 0) * (l.unitPrice || 0),
        0,
      ),
    [formState.cartLines],
  );

  const remaining = useMemo(() => {
    const r = subTotal - formState.deposit;
    return r < 0 ? 0 : r;
  }, [subTotal, formState.deposit]);

  const totalPayments = useMemo(
    () => payments.reduce((sum, p) => sum + (p.amount || 0), 0),
    [payments],
  );

  const remainingAfterPayments = useMemo(
    () => subTotal - totalPayments,
    [subTotal, totalPayments],
  );

  const isValid = Boolean(
    formState.selectedClientId && formState.cartLines.length > 0,
  );

  const isSubmitting =
    createBulkOrderMutation.isPending ||
    updateOrderFromPosMutation.isPending ||
    addPaymentMutation.isPending;

  // ─── HELPERS ───
  const updateFormField = useCallback(
    <K extends keyof PosFormState>(field: K, value: PosFormState[K]) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
      if (field !== "cartLines") setHasUnsavedChanges(true);
    },
    [],
  );

  const updateCartLine = useCallback(
    (index: number, field: keyof PosCartLine, value: any) => {
      setFormState((prev) => {
        const next = [...prev.cartLines];
        next[index] = { ...next[index], [field]: value };
        return { ...prev, cartLines: next };
      });
      setHasUnsavedChanges(true);
    },
    [],
  );

  const clearAll = useCallback(() => {
    setFormState({
      selectedClientId: "",
      deposit: 0,
      documentType: "INVOICE",
      deliveryPlace: "",
      expectedDeliveryDate: "",
      paymentMethod: "CASH",
      cartLines: [],
    });
    setIsEditing(false);
    setEditingInvoiceId(null);
    setLoadingInvoiceId(null);
    setNewPaymentAmount(0);
    setHasUnsavedChanges(false);
    initializedRef.current = null;
  }, []);

  // ─── CHARGEMENT FACTURE (init unique, pas de sync auto) ───
  const initializedRef = useRef<number | null>(null);

  if (
    loadingInvoiceId &&
    orderDetail &&
    initializedRef.current !== loadingInvoiceId
  ) {
    initializedRef.current = loadingInvoiceId;

    const lines: PosCartLine[] = orderDetail.orders.map((order: any) => ({
      id: order.id,
      designation: order.designation,
      productId: order.product?.id || null,
      dimensions: order.dimensions,
      label: order.label,
      quantity: order.quantity,
      unitPrice: order.unitPrice,
      atelierNote: order.notes?.[0]?.text || "",
    }));

    setFormState({
      selectedClientId: String(orderDetail.clientId ?? ""),
      deposit: orderDetail.deposit ?? 0,
      documentType: orderDetail.documentType ?? "INVOICE",
      deliveryPlace: orderDetail.deliveryPlace ?? "",
      expectedDeliveryDate: orderDetail.expectedDeliveryDate
        ? new Date(orderDetail.expectedDeliveryDate).toISOString().split("T")[0]
        : "",
      paymentMethod: orderDetail.paymentMethod ?? "CASH",
      cartLines: lines,
    });

    setIsEditing(true);
    setEditingInvoiceId(orderDetail.id);
    setLoadingInvoiceId(null);
    setHasUnsavedChanges(false);
  }

  // ─── DIALOG HELPERS ───
  const openConfirm = useCallback((action: PendingAction) => {
    setPendingAction(action);
    setIsConfirmOpen(true);
  }, []);

  const handleConfirmAction = useCallback(() => {
    if (!pendingAction) return;

    switch (pendingAction.type) {
      case "newOrder":
        clearAll();
        break;
      case "cancelEdit":
        if (editingInvoiceId) {
          initializedRef.current = null;
          setLoadingInvoiceId(editingInvoiceId);
        }
        break;
      case "deletePayment":
        deletePaymentMutation.mutate(pendingAction.paymentId, {
          onSuccess: () => refetchPayments(),
        });
        break;
    }

    setIsConfirmOpen(false);
    setPendingAction(null);
  }, [
    pendingAction,
    editingInvoiceId,
    deletePaymentMutation,
    refetchPayments,
    clearAll,
  ]);

  // ─── HANDLERS ───
  const handleNewOrder = useCallback(() => {
    if (formState.cartLines.length > 0 || isEditing) {
      openConfirm({ type: "newOrder" });
      return;
    }
    clearAll();
  }, [formState.cartLines.length, isEditing, openConfirm, clearAll]);

  const handleCancelEdit = useCallback(() => {
    if (editingInvoiceId) openConfirm({ type: "cancelEdit" });
  }, [editingInvoiceId, openConfirm]);

  const handleLoadInvoice = useCallback((invoice: any) => {
    initializedRef.current = null;
    setLoadingInvoiceId(invoice.id);
    setIsInvoiceModalOpen(false);
  }, []);

  const handleAddEmptyLine = useCallback(() => {
    const newLine: PosCartLine = {
      designation: "",
      productId: null,
      dimensions: "",
      label: "",
      quantity: 1,
      unitPrice: 0,
      atelierNote: "",
    };
    setFormState((prev) => ({
      ...prev,
      cartLines: [...prev.cartLines, newLine],
    }));
    setHasUnsavedChanges(true);
  }, []);

  const handleRemoveLine = useCallback((index: number) => {
    setFormState((prev) => ({
      ...prev,
      cartLines: prev.cartLines.filter((_, i) => i !== index),
    }));
    setHasUnsavedChanges(true);
  }, []);

  const handleDeletePayment = useCallback(
    (paymentId: number) => {
      openConfirm({ type: "deletePayment", paymentId });
    },
    [openConfirm],
  );

  const handleAddPayment = useCallback(async () => {
    if (!editingInvoiceId || !newPaymentAmount || newPaymentAmount <= 0) return;
    await addPaymentMutation.mutateAsync({
      id: editingInvoiceId,
      data: { amount: newPaymentAmount, method: formState.paymentMethod },
    });
    refetchPayments();
    setNewPaymentAmount(0);
  }, [
    editingInvoiceId,
    newPaymentAmount,
    formState.paymentMethod,
    addPaymentMutation,
    refetchPayments,
  ]);

  const handleValidateOrder = useCallback(
    (documentType: "INVOICE" | "QUOTE") => {
      const lines = formState.cartLines.map((line) => ({
        orderId: isEditing ? (line.id ?? null) : undefined,
        designation: line.designation,
        productId: line.productId,
        dimensions: line.dimensions,
        label: line.label,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        atelierNote: line.atelierNote,
      }));

      const payload = {
        clientId: formState.selectedClientId,
        documentType,
        deposit: isEditing ? 0 : formState.deposit,
        deliveryPlace: formState.deliveryPlace || null,
        expectedDeliveryDate: formState.expectedDeliveryDate || null,
        paymentMethod: formState.paymentMethod || "CASH",
        lines,
      };

      if (isEditing && editingInvoiceId) {
        updateOrderFromPosMutation.mutate(
          { invoiceId: editingInvoiceId, data: payload },
          { onSuccess: () => setHasUnsavedChanges(false) },
        );
      } else {
        createBulkOrderMutation.mutate(payload, {
          onSuccess: () => clearAll(),
        });
      }
    },
    [
      formState,
      isEditing,
      editingInvoiceId,
      updateOrderFromPosMutation,
      createBulkOrderMutation,
      clearAll,
    ],
  );

  return {
    // raw state
    isEditing,
    editingInvoiceId,
    loadingInvoiceId,
    isLoadingOrder,
    clients,
    clientsLoading,
    products,
    isCatalogLoading,
    payments,
    formState,
    hasUnsavedChanges,
    isInvoiceModalOpen,
    setIsInvoiceModalOpen,
    newPaymentAmount,
    setNewPaymentAmount,
    isConfirmOpen,
    setIsConfirmOpen,
    pendingAction,

    // derived
    subTotal,
    remaining,
    totalPayments,
    remainingAfterPayments,
    isValid,
    isSubmitting,

    // actions
    handleNewOrder,
    handleCancelEdit,
    handleConfirmAction,
    handleLoadInvoice,
    handleAddEmptyLine,
    handleRemoveLine,
    updateCartLine,
    handleDeletePayment,
    handleAddPayment,
    handleValidateOrder,
    updateFormField,
    clearAll,
  };
};
