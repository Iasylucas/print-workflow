export const USER_ERRORS = {
  NOT_FOUND: "Utilisateur non trouvé",
  EMAIL_EXISTS: "Cet email est déjà utilisé",
  FAILED_CREATION: "Échec de la création de l'utilisateur",
  FAILED_UPDATE: "Échec de la mise à jour de l'utilisateur",
  FAILED_DELETE: "Échec de la suppression de l'utilisateur",
  CANNOT_DELETE_OWN_ACCOUNT: "Vous ne pouvez pas supprimer votre propre compte",
  CANNOT_UPDATE_OWN_ROLE: "Vous ne pouvez pas modifier votre propre rôle",
  CANNOT_DEACTIVATE_OWN_ACCOUNT:
    "Vous ne pouvez pas désactiver votre propre compte",
} as const;

export const INVITATION_ERRORS = {
  NOT_FOUND: "Invitation non trouvée",

  FAILED_FETCHING: "Échec de la récupération des invitations",
  FAILED_DELETE: "Échec de la suppression de l'invitation",
  CANNOT_DELETE_OWN_INVITATION:
    "Vous ne pouvez pas supprimer votre propre invitation",
} as const;
