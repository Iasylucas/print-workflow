import { z } from "zod";

export const tokenSchema = z.string().min(1, "Token is required");
