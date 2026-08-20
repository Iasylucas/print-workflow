export const ORDERS_ERRORS = {
  NOT_FOUND: "Commande introuvable",
  NO_FIELDS_TO_UPDATE: "Aucun champ à mettre à jour",
  UPDATE_FAILED: "Échec de la mise à jour de la commande",
  NOTE_FAILED: "Échec de l'ajout de la note",
  FILE_FAILED: "Échec de l'ajout du fichier",
  DELETE_NOTE_FAILED: "Échec de la suppression de la note",
  DELETE_FILE_FAILED: "Échec de la suppression du fichier",
  INVALID_STATUS_TRANSITION: "Transition de statut invalide",
  FORBIDDEN: "Vous n'avez pas les droits pour effectuer cette action",
} as const;
