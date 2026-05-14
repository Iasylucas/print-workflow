import { NextFunction, Request, Response } from "express";
import { ApiResult, AuthResponse } from "./auth.types.js";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { authService } from "./auth.service.js";

export const authController = {
  //register controller
  async register(req: Request, res: Response<ApiResult<AuthResponse>>) {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      const details = result.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        error: "validation failed",
        details,
      });
    }

    const { token, user } = await authService.register(result.data);
    return res.status(201).json({
      success: true,
      data: { user, token },
    });
  },

  //login controller
  async loginSchema(req: Request, res: Response<ApiResult<AuthResponse>>) {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      const details = result.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        error: "validation failed",
        details,
      });
    }
  },
};
