import { z } from "zod";

export const imageUrlSchema = z.url("Invalid URL format").optional().nullable();
