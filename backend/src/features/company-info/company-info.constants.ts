export const COMPANY_INFO_ERRORS = {
  NOT_FOUND: "Informations de l'entreprise non trouvées",
  NOT_FOUND_ID: (id: number) =>
    `Version des informations de l'entreprise avec l'id ${id} non trouvée`,
  FAILED_CREATION: "Erreur lors de la création de la nouvelle version",
} as const;
