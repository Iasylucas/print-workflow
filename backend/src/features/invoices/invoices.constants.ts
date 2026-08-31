export const INVOICE_ERRORS = {
  NOT_FOUND: "Facture introuvable",
  NO_FIELDS_TO_UPDATE: "Aucun champ à mettre à jour",
  UPDATE_FAILED: "Échec de la mise à jour de la facture",
  DELIVER_FAILED: "Échec du marquage de la facture comme livrée",
  ALREADY_PAID: "Cette facture est déjà entièrement payée",
  PAYMENT_EXCEEDS_REMAINING: "Le montant du paiement dépasse le reste à payer",
  PAYMENT_FAILED: "Échec de l'ajout du paiement",
  DELETE_PAYMENT_FAILED: "Échec de la suppression du paiement",
  DELETE_FAILED: "Échec de la suppression de la facture",
  RESTORE_FAILED: "Échec de la restauration de la facture",
} as const;
