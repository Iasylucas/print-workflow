export const IN_PROGRESS_STATUSES = ["in_progress", "file_completed"] as const;

export const IN_PRODUCTION_STATUSES = [
  "printing_in_progress",
  "cutting_in_progress",
] as const;

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
  STATS_FAILED: "Impossible de récupérer les statistiques des commandes",
  STATUS_ALREADY_ACTIVE: "Ce statut est déjà actif",
} as const;

export const ORDER_STATUS_PIPELINE: Record<string, number> = {
  waiting_for_visual: -1,
  waiting_for_file: 0,
  in_progress: 1,
  file_completed: 2,
  printing_in_progress: 3,
  cutting_in_progress: 4,
  ready_for_delivery: 5,
  delivered: 6,
};

export const SERVICE_PRODUCT_ID_THRESHOLD = 12;
export const isServiceProduct = (
  productId: number | null | undefined,
): boolean => !!productId && productId > SERVICE_PRODUCT_ID_THRESHOLD;
