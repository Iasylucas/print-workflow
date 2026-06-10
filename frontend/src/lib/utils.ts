import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Force une promesse à attendre une durée minimale avant de se résoudre.
 * Utile pour éviter les clignotements d'UI (Skeletons/Spinners) trop rapides.
 */
export const withMinimumDelay = <T>(
  promise: Promise<T>,
  delay = 400,
): Promise<T> => {
  return Promise.all([
    promise,
    new Promise((resolve) => setTimeout(resolve, delay)),
  ]).then(([result]) => result);
};
