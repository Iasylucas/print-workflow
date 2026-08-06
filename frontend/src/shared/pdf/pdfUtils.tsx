// frontend/src/shared/pdf/pdfUtils.ts
export const sanitizeFileName = (name: string): string => {
  return name
    .toString()
    .trim()
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, "_");
};

export const formatPrice = (value: number): string => {
  if (value === 0) return "0";
  // Convertir en string et ajouter les espaces tous les 3 chiffres
  const parts = value.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
};
