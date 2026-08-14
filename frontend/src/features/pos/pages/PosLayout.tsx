import { AmalgamM2Block } from "../components/AmalgamM2Block";
import { PriceCalculationBlock } from "../components/PriceCalculationBlock";
import { PosCart } from "../components/PosCart";
import { FolderOpen, Plus } from "lucide-react";
import { AmalgamA4Block } from "../components/AmalgamA4Block";
import { InvoiceSearchModal } from "../components/InvoiceSearchModal";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { usePosCart } from "../hooks/usePosCart";
import { ClientFormModal } from "@/features/client/components/ClientFormModal";
import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { useParams } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Navigate } from "react-router-dom";

export const PosLayout = () => {
  const { user } = useAuth();
  // Dans le composant
  const { invoiceId } = useParams<{ invoiceId?: string }>();

  // Passe l'ID à `usePosCart`
  const pos = usePosCart(invoiceId ? Number(invoiceId) : null);
  // Ajouter en haut avec les autres useState
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);

  if (user?.role !== "ADMIN" && user?.role !== "SALES") {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300 font-sans text-xs">
      <PageHeader
        title="Point de Vente"
        subtitle="Gérez vos commandes et paiements en temps réel."
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => pos.setIsInvoiceModalOpen(true)}
          className="gap-2"
        >
          <FolderOpen className="h-4 w-4" />
          Charger une facture
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={pos.handleNewOrder}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Nouvelle commande
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start w-full">
        <div className="lg:col-span-4 space-y-6 w-full">
          <AmalgamM2Block products={pos.products} />
          <AmalgamA4Block products={pos.products} />
          <PriceCalculationBlock products={pos.products} />
        </div>

        <div className="lg:col-span-6 w-full h-full">
          <PosCart
            formState={pos.formState}
            selectedClient={pos.selectedClient}
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
            onCancelEdit={pos.handleCancelEdit}
            hasUnsavedChanges={pos.hasUnsavedChanges}
            onAddClient={() => setIsAddClientModalOpen(true)}
            isLoadingOrder={pos.isLoadingOrder}
          />
        </div>
      </div>

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
      <ClientFormModal
        isOpen={isAddClientModalOpen}
        onOpenChange={setIsAddClientModalOpen}
      />
    </div>
  );
};
