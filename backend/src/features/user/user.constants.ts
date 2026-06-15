// export const USER_ERRORS = {
//   NOT_FOUND: "User not found",
//   EMAIL_EXISTS: "User email already exists",
//   FAILED_CREATION: "Failed to create user",
//   FAILED_UPDATE: "Failed to update user",
//   FAILED_DELETE: "Failed to delete user",
//   CANNOT_DELETE_OWN_ACCOUNT: "You cannot delete your own account",
//   CANNOT_UPDATE_OWN_ROLE: "You cannot change your own role",
// } as const;
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
