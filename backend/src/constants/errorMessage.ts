export const AUTH_ERRORS = {
  EMAIL_EXISTS: "Email already exists",
  INVALID_CREDENTIALS: "Invalid email or password",
  INVALID_PASSWORD: "Invalid password",
  ACCOUNT_DELETED:
    "This account was deleted. Contact support to reactivate it.",
  USER_NOT_FOUND: "User not found",
  FAILED_CREATION: "Failed to create user",
  REQUIRED_FIRST_NAME: "First name is required",
  REQUIRED_LAST_NAME: "Last name is required",
  ROLE_IS_REQUIRED: "Role is required",
  NOT_ACTIVATE: "This accound is not activated",
} as const;
