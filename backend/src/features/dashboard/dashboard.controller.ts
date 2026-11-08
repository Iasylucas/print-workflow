import { Request, Response } from "express";
import { catchAsync } from "@/utils/catchAsync.js";
import { dashboardService } from "./dashboard.service.js";

export const dashboardController = {
  getStats: catchAsync(async (_req: Request, res: Response): Promise<void> => {
    const stats = await dashboardService.getStats();
    res.status(200).json({ success: true, data: stats });
  }),

  getPaymentsTrend: catchAsync(
    async (_req: Request, res: Response): Promise<void> => {
      const trend = await dashboardService.getPaymentsTrend();
      res.status(200).json({ success: true, data: trend });
    },
  ),
};