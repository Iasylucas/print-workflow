import { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service.js";
import {
  inviteUserSchema,
  finalizeRegistrationSchema,
  loginSchema,
  changePasswordSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
  confirmEmailChangeSchema,
} from "./auth.schema.js";
import { catchAsync } from "@/utils/catchAsync.js";

export const authController = {
  // action to invite a collabolator by the admin
  invite: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const validatedData = inviteUserSchema.parse(req.body);

    const { user } = await authService.invite(validatedData);
    res.status(201).json({
      success: true,
      message: "Invitation processed and email sent successfully",
      data: { user },
    });
  }),

  // invite action finilize by the colaborator
  finalize: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const validatedData = finalizeRegistrationSchema.parse(req.body);
    const result = await authService.finalizeRegistration(validatedData);

    res.status(200).json({
      success: true,
      message: "Account activated successfully",
      data: result,
    });
  }),

  // login classique for users
  login: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.login(validatedData);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  }),

  // change password for authenticated users
  changePassword: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { sub: userId } = req.user!;
      const validated = changePasswordSchema.parse(req.body);
      await authService.changePassword(userId, validated);
      res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
    },
  ),

  // forgot password (public)
  forgotPassword: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { email } = forgotPasswordSchema.parse(req.body);
      await authService.forgotPassword(email);
      res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, you will receive a password reset link.",
      });
    },
  ),

  // reset password (public)
  resetPassword: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { token, newPassword } = resetPasswordSchema.parse(req.body);
      await authService.resetPassword(token, newPassword);
      res.status(200).json({
        success: true,
        message: "Password reset successfully. You can now log in.",
      });
    },
  ),

  // confirm email change (public)
  confirmEmailChange: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { token } = confirmEmailChangeSchema.parse(req.body);
      await authService.confirmEmailChange(token);
      res.status(200).json({
        success: true,
        message:
          "Email changed successfully. You can now log in with your new email.",
      });
    },
  ),

  // get me
  getMe: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.sub;

    const result = await authService.getMe(userId);
    return res.status(200).json({
      success: true,
      ...result,
    });
  }),
};
