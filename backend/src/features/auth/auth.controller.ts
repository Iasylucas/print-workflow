import { Request, Response } from "express";
import { authService } from "./auth.service.js";
import {
  inviteUserSchema,
  finalizeRegistrationSchema,
  loginSchema,
} from "./auth.schema.js";
import { catchAsync } from "@/utils/catchAsync.js";

export const authController = {
  // actin to invite a collabolator by the admin
  async invite(req: Request, res: Response): Promise<void> {
    const validatedData = inviteUserSchema.parse(req.body);

    const { user } = await authService.invite(validatedData);
    res.status(201).json({
      success: true,
      message: "Invitation processed and email sent successfully",
      data: { user },
    });
  },
  // invite action finilize by the colaborator
  async finalize(req: Request, res: Response): Promise<void> {
    const validatedData = finalizeRegistrationSchema.parse(req.body);
    const result = await authService.finalizeRegistration(validatedData);

    res.status(200).json({
      success: true,
      message: "Account activated successfully",
      data: result,
    });
  },

  // login classique for users
  async login(req: Request, res: Response): Promise<void> {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.login(validatedData);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  },
};

// export of the controller with catchAsync for error handling in routes
export const authControllerWrapped = {
  invite: catchAsync(authController.invite),
  finalize: catchAsync(authController.finalize),
  login: catchAsync(authController.login),
};
