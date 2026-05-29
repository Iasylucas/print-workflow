import { z } from "zod";

export const firstNameSchema = z
  .string()
  .trim()
  .min(2, "First name must be at least 2 characters")
  .max(50);

export const lastNameSchema = z
  .string()
  .trim()
  .min(2, "Last name must be at least 2 characters")
  .max(50);
