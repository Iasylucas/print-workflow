import { z } from "zod";

const UserRole = z.enum(["ADMIN", "SALES", "PRINTER", "GRAPHIC_DESIGNER"]);

export const registerSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters long"),
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
  role: UserRole.default("SALES"),
});
