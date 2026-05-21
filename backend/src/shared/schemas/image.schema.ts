import { z } from "zod";

export const imageUrlSchema = z.object({
  url: z.url("Invalid URL format").optional(),
});
