export const PRODUCT_ERRORS = {
  NOT_FOUND: "Le produit demandé n'existe pas.",
  DUPLICATE_NAME: "Un produit portant ce nom ou ce slug existe déjà.",
  DELETE_NOT_FOUND: "Le produit à supprimer n'existe pas.",
  UPDATE_NOT_FOUND: "Le produit à modifier n'existe pas.",
  DUPLICATE_SLUG: "Un autre produit porte déjà ce nom.",
  CREATE_FAILED: "Échec de la création du produit.",
  UPDATE_FAILED:
    "Une erreur est survenue lors de la mise à jour de la grille tarifaire.",
  DELETE_FAILED: "Échec de la suppression du produit.",
} as const;
