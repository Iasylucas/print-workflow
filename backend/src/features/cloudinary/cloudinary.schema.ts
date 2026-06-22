import { z } from "zod";

export const generateSignatureSchema = z.object({
  folder: z.string().trim().min(1).default("avatars"),
  publicId: z.string().trim().min(1).optional(),
});
