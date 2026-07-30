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
import { usePosCart } from "./usePosCart";

export const PosLayout = () => {
  const pos = usePosCart();

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300 font-sans text-xs">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5 text-primary stroke-[2.5]" />
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Point de Vente (POS) & Chiffrage
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={pos.handleNewOrder}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouvelle commande
          </Button>

          {pos.isEditing && pos.hasUnsavedChanges && (
            <Button
              variant="ghost"
              size="sm"
              onClick={pos.handleCancelEdit}
              className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <X className="h-4 w-4" />
              Annuler les modifications
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => pos.setIsInvoiceModalOpen(true)}
            className="gap-2"
          >
            <FolderOpen className="h-4 w-4" />
            Charger une facture
          </Button>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start w-full">
        <div className="lg:col-span-4 space-y-6 w-full">
          <AmalgamM2Block products={pos.products} />
          <AmalgamA4Block products={pos.products} />
          <PriceCalculationBlock products={pos.products} />
        </div>

        <div className="lg:col-span-6 w-full h-full">
          <PosCart
            formState={pos.formState}
            clients={pos.clients}
            products={pos.products}
            isLoadingClients={pos.clientsLoading}
            isEditing={pos.isEditing}
            payments={pos.payments}
            isSubmitting={pos.isSubmitting}
            isValid={pos.isValid}
            subTotal={pos.subTotal}
            remaining={pos.remaining}
            totalPayments={pos.totalPayments}
            remainingAfterPayments={pos.remainingAfterPayments}
            newPaymentAmount={pos.newPaymentAmount}
            onAddLine={pos.handleAddEmptyLine}
            onRemoveLine={pos.handleRemoveLine}
            onUpdateLine={pos.updateCartLine}
            onUpdateFormField={pos.updateFormField}
            onValidateOrder={pos.handleValidateOrder}
            onAddPayment={pos.handleAddPayment}
            onDeletePayment={pos.handleDeletePayment}
            onSetNewPaymentAmount={pos.setNewPaymentAmount}
          />
        </div>
      </div>

      {/* MODALS */}
      <InvoiceSearchModal
        isOpen={pos.isInvoiceModalOpen}
        onOpenChange={pos.setIsInvoiceModalOpen}
        onSelectInvoice={pos.handleLoadInvoice}
      />

      <AlertDialog open={pos.isConfirmOpen} onOpenChange={pos.setIsConfirmOpen}>
        <ConfirmationDialog
          state={{
            isOpen: pos.isConfirmOpen,
            title:
              pos.pendingAction?.type === "newOrder"
                ? "Nouvelle commande"
                : pos.pendingAction?.type === "cancelEdit"
                  ? "Annuler les modifications"
                  : pos.pendingAction?.type === "deletePayment"
                    ? "Supprimer le paiement"
                    : "",
            description:
              pos.pendingAction?.type === "newOrder"
                ? "Voulez-vous vraiment commencer une nouvelle commande ? Les modifications en cours seront perdues."
                : pos.pendingAction?.type === "cancelEdit"
                  ? "Voulez-vous annuler les modifications et recharger la facture originale ?"
                  : pos.pendingAction?.type === "deletePayment"
                    ? "Cette action est irréversible."
                    : "",
            onConfirm: pos.handleConfirmAction,
            isDestructive: pos.pendingAction?.type === "deletePayment",
          }}
          onOpenChange={pos.setIsConfirmOpen}
        />
      </AlertDialog>
    </div>
  );
};
