import { Request, Response } from "express";
import { catchAsync } from "@/utils/catchAsync.js";
import { notificationsService } from "./notifications.service.js";
import { notificationIdParamSchema, notificationsQuerySchema } from "./notifications.schema.js";

export const notificationsController = {
  list: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.sub;
    const query = notificationsQuerySchema.parse(req.query);
    const result = await notificationsService.list(userId, query);
    res.status(200).json({ success: true, data: result });
  }),

  getUnreadCount: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.user!.sub;
      const result = await notificationsService.getUnreadCount(userId);
      res.status(200).json({ success: true, data: result });
    },
  ),

  markAsRead: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.sub;
    const { id } = notificationIdParamSchema.parse(req.params);
    await notificationsService.markAsRead(id, userId);
    res.status(200).json({ success: true, message: "Notification lue" });
  }),

  markAllAsRead: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.user!.sub;
      await notificationsService.markAllAsRead(userId);
      res
        .status(200)
        .json({ success: true, message: "Toutes les notifications sont lues" });
    },
  ),

  delete: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.sub;
    const { id } = notificationIdParamSchema.parse(req.params);
    await notificationsService.delete(id, userId);
    res.status(200).json({ success: true, message: "Notification supprimée" });
  }),
};