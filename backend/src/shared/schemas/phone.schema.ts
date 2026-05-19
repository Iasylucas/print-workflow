import { z } from "zod";

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format");

export const phoneOptionalSchema = phoneSchema.nullable().optional();
