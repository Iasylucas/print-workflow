import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5050),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(32),
  RESEND_API_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);