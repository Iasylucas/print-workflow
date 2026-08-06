// frontend/src/shared/pdf/pdfUtils.ts
export const sanitizeFileName = (name: string): string => {
  return name
    .toString()
    .trim()
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, "_");
};
