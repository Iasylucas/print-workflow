import { Request, Response, NextFunction } from "express";
import { AppError } from "@/shared/error/error.js";
import { ZodError } from "zod";
import { env } from "@/config/env.js";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      details: err.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  console.error(`[ERROR] ${err.stack}`);

  res.status(500).json({
    success: false,
    error:
      env.NODE_ENV === "production" ? "Internal Server Error" : err.message,
  });
};
