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
  // Lister les utilisateurs (admin)
  listUsers: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const query = userQuerySchema.parse(req.query);
    const result = await userService.listUsers(query);
    res.status(200).json({ success: true, data: result });
  }),

  // Récupérer un utilisateur par ID (admin)
  getUserById: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const id = uuidSchema.parse(req.params.id);
      const user = await userService.getUserById(id);
      res.status(200).json({ success: true, data: user });
    },
  ),

  // Mettre à jour un utilisateur (admin)
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

  // Soft delete d’un utilisateur (admin)
  deleteUser: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = uuidSchema.parse(req.params.id);
    const currentUserId = req.user!.sub;
    await userService.deleteUser(id, currentUserId);
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  }),

  // Récupérer son propre profil (user connecté)
  getMyProfile: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { sub: userId } = req.user!;
      const user = await userService.getMyProfile(userId);
      res.status(200).json({ success: true, data: user });
    },
  ),

  // Mettre à jour son propre profil (user connecté)
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

  // Admin : initier un changement d'email pour un utilisateur
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

  // lister les invitations (admin)
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

  // Supprimer/Annuler une invitation (admin)
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
