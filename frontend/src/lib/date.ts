/**
 * Helpers de formatage de dates.
 * Important : on travaille en local (UTC+3 à Madagascar), pas en UTC.
 * `toISOString()` est interdit pour les inputs de type "date" car il décale le jour.
 */

/**
 * Retourne une date au format YYYY-MM-DD en heure locale.
 */
export const toDateInputValue = (
  date: Date | string | undefined,
): string => {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Convertit une valeur d'input "date" (YYYY-MM-DD) en ISO complet pour l'API.
 * Retourne undefined si vide.
 */
export const toIsoDate = (
  value: string | Date | undefined,
): string | undefined => {
  if (!value) return undefined;
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
};

/**
 * Plage par défaut : début du mois courant (00:00:00.000 local)
 * jusqu'à aujourd'hui (23:59:59.999 local).
 */
export const getDefaultDateRange = (): { start: Date; end: Date } => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999,
  );
  return { start, end };
};