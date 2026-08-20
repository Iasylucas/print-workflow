import { Request, Response } from "express";
import { catchAsync } from "@/utils/catchAsync.js";
import { userService } from "./user.service.js";
import {
  updateUserSchema,
  updateProfileSchema,
  userQuerySchema,
  uuidSchema,
  updateUserWithEmailSchema,
  invitationQuerySchema,
} from "./user.schema.js";

export const userController = {
  listUsers: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const query = userQuerySchema.parse(req.query);
    const result = await userService.listUsers(query);
    res.status(200).json({ success: true, data: result });
  }),

  getUserById: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const id = uuidSchema.parse(req.params.id);
      const user = await userService.getUserById(id);
      res.status(200).json({ success: true, data: user });
    },
  ),

  updateUser: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = uuidSchema.parse(req.params.id);
    const currentUserId = req.user!.sub;
    const validated = updateUserSchema.parse(req.body);
    const updated = await userService.updateUser(id, currentUserId, validated);
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updated,
    });
  }),

  deleteUser: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = uuidSchema.parse(req.params.id);
    const currentUserId = req.user!.sub;
    await userService.deleteUser(id, currentUserId);
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  }),

  getMyProfile: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { sub: userId } = req.user!;
      const user = await userService.getMyProfile(userId);
      res.status(200).json({ success: true, data: user });
    },
  ),

  updateMyProfile: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { sub: userId } = req.user!;
      const validated = updateProfileSchema.parse(req.body);
      const updated = await userService.updateMyProfile(userId, validated);
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updated,
      });
    },
  ),

  initiateEmailChange: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const id = uuidSchema.parse(req.params.id);
      const { newEmail } = updateUserWithEmailSchema.parse(req.body);
      await userService.adminInitiateEmailChange(id, newEmail);
      res.status(200).json({
        success: true,
        message: "Email change request sent to the user's new address",
      });
    },
  ),

  listInvitations: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const query = invitationQuerySchema.parse(req.query);
      const result = await userService.listInvitations(query);

      res.status(200).json({
        success: true,
        data: result,
      });
    },
  ),

  cancelInvitation: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const id = uuidSchema.parse(req.params.id);

      await userService.cancelInvitation(id);

      res.status(200).json({
        success: true,
        message: "L'invitation a été annulée avec succès.",
      });
    },
  ),
};
