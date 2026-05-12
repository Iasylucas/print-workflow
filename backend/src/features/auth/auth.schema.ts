import { z } from "zod";
import { v7 as uuidv7 } from "uuid";

const UserRole = z.enum(["ADMIN", "SALES", "PRINTER", "GRAPHIC_DESIGNER"]);
const PasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );
const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Invalid email address"));

export const registerSchema = z
  .object({
    id: z.uuidv7().default(() => uuidv7()),
    username: z.string().min(1, "Username must be at least 2 characters long"),
    email: emailSchema,
    role: UserRole.default("SALES"),
    password: PasswordSchema,
    confirmPassword: PasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email or username is required")
    .refine(
      (val) => {
        const isEmail = emailSchema.safeParse(val).success;
        const isUsername = val.length >= 1;
        return isEmail || isUsername;
      },
      {
        message: "Invalid email or username",
      },
    ),
  password: z.string().min(1, "Password is required"),
});
