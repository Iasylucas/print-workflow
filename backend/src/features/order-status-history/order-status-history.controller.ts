import { Request, Response } from "express";
import { catchAsync } from "@/utils/catchAsync.js";
import { orderStatusHistoryService } from "./order-status-history.service.js";
import { orderIdParamSchema, orderStatusHistoryIdParamSchema, orderStatusHistoryQuerySchema } from "./order-status-history.schema.js";

export const orderStatusHistoryController = {
  // ============================================================
  // LISTER L'HISTORIQUE (pagination, filtres)
  // ============================================================
  list: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const query = orderStatusHistoryQuerySchema.parse(req.query);
    const result = await orderStatusHistoryService.list(query);
    res.status(200).json({ success: true, data: result });
  }),

  // ============================================================
  // HISTORIQUE D'UNE COMMANDE
  // ============================================================
  getByOrderId: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { orderId } = orderIdParamSchema.parse(req.params);
      const history = await orderStatusHistoryService.getByOrderId(orderId);
      res.status(200).json({ success: true, data: history });
    },
  ),

  // ============================================================
  // DÉTAIL D'UNE ENTRÉE
  // ============================================================
  getById: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = orderStatusHistoryIdParamSchema.parse(req.params);
    const entry = await orderStatusHistoryService.getById(id);
    res.status(200).json({ success: true, data: entry });
  }),
};