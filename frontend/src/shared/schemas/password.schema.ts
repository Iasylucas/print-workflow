import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères")
  .regex(/[A-Z]/, "Doit contenir au moins une majuscule")
  .regex(/[a-z]/, "Doit contenir au moins une minuscule")
  .regex(/[0-9]/, "Doit contenir au moins un chiffre")
  .regex(/[^A-Za-z0-9]/, "Doit contenir au moins un caractère spécial");
