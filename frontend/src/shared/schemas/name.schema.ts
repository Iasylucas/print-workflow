// shared/schemas/name.schema.ts
import { z } from "zod";

export const firstNameSchema = z
  .string()
  .trim()
  .min(2, "Le prénom doit contenir au moins 2 caractères")
  .max(50, "Le prénom est trop long");

export const lastNameSchema = z
  .string()
  .trim()
  .min(2, "Le nom doit contenir au moins 2 caractères")
  .max(50, "Le nom est trop long");
