import { z } from "zod";

export const phoneSchema = z
  .string()
  .trim()
  .min(10, "Le numéro de téléphone doit contenir au moins 10 caractères")
  .regex(/^[0-9+\-\s()]+$/, "Format de numéro invalide")
  .optional()
  .nullable();
