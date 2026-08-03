import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(5050),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string(),
  RESEND_API_KEY: z.string().optional(),
  MAIL_HOST: z.string(),
  MAIL_PORT: z.string(),
  MAIL_USER: z.email(),
  MAIL_PASS: z.string(),
  MAIL_AUTH: z.string(),
  FRONTEND_URL: z.url(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
