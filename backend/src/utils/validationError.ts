import { Response } from "express";
import { ZodError } from "zod";

export function sendValidationError(res: Response, error: ZodError) {
  const details = error.issues.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));

  return res.status(400).json({
    success: false,
    error: "Validation failed",
    details,
  });
}
