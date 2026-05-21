import { Request, Response } from "express";
import { authService } from "./auth.service.js";
import {
  inviteUserSchema,
  finalizeRegistrationSchema,
  loginSchema,
  changePasswordSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
} from "./auth.schema.js";
import { catchAsync } from "@/utils/catchAsync.js";

export const authController = {
  // action to invite a collabolator by the admin
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

  // change password for authenticated users
  async changePassword(req: Request, res: Response) {
    const { sub: userId } = req.user!;
    const validated = changePasswordSchema.parse(req.body);
    await authService.changePassword(userId, validated);
    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  },

  // forgot password (public)
  async forgotPassword(req: Request, res: Response) {
    const { email } = forgotPasswordSchema.parse(req.body);
    await authService.forgotPassword(email);
    res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, you will receive a password reset link.",
    });
  },

  // reset password (public)
  async resetPassword(req: Request, res: Response) {
    const { token, newPassword } = resetPasswordSchema.parse(req.body);
    await authService.resetPassword(token, newPassword);
    res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now log in.",
    });
  },
};

// export of the controller with catchAsync for error handling in routes
export const authControllerWrapped = {
  invite: catchAsync(authController.invite),
  finalize: catchAsync(authController.finalize),
  login: catchAsync(authController.login),
  changePassword: catchAsync(authController.changePassword),
  forgotPassword: catchAsync(authController.forgotPassword),
  resetPassword: catchAsync(authController.resetPassword),
};
