export const USER_ERRORS = {
  NOT_FOUND: "User not found",
  EMAIL_EXISTS: "User email already exists",
  FAILED_CREATION: "Failed to create user",
  FAILED_UPDATE: "Failed to update user",
  FAILED_DELETE: "Failed to delete user",
  CANNOT_DELETE_OWN_ACCOUNT: "You cannot delete your own account",
  CANNOT_UPDATE_OWN_ROLE: "You cannot change your own role",
} as const;
