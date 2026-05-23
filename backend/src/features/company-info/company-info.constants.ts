export const COMPANY_INFO_ERRORS = {
  NOT_FOUND: "Company info not found",
  NOT_FOUND_ID: (id: number) => `Company info version with id ${id} not found`,
  FAILED_CREATION: "Failed to create new company info version",
} as const;
