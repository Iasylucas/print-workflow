import { z } from "zod";
import { v7 as uuidv7 } from "uuid";

// 1. Roles autorisés dans ton système
const UserRole = z.enum(["ADMIN", "SALES", "PRINTER", "GRAPHIC_DESIGNER"]);

// 2. Règles strictes pour le mot de passe (réutilisable)
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

// 3. Normalisation et validation de l'email (Beautiful DB)
const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Invalid email address"));

// input for the invitation action (by the admin)
export const inviteUserSchema = z.object({
  id: z.uuid().default(() => uuidv7()),
  email: emailSchema,
  role: UserRole.default("SALES"),
});

// input for the finalization action (by the colaborator)
export const finalizeRegistrationSchema = z
  .object({
    token: z.string().min(1, "Invitation token is required"),
    firstName: z
      .string()
      .trim()
      .min(2, "Firstname must be at least 2 characters long"),
    lastName: z
      .string()
      .trim()
      .min(2, "Lastname must be at least 2 characters long"),
    password: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// input for the login action (by the users)
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});
