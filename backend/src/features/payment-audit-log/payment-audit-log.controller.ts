import { Request, Response } from "express";
import { catchAsync } from "@/utils/catchAsync.js";
import { paymentAuditLogService } from "./payment-audit-log.service.js";
import { paymentAuditLogQuerySchema } from "./payment-audit-log.schema.js";
import { z } from "zod";

const uuidParamSchema = z.uuid();

export const paymentAuditLogController = {
  // ============================================================
  // LISTER L'HISTORIQUE (pagination, filtres)
  // ============================================================
  list: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const query = paymentAuditLogQuerySchema.parse(req.query);
    const result = await paymentAuditLogService.list(query);
    res.status(200).json({ success: true, data: result });
  }),

  // ============================================================
  // DÉTAIL D'UNE ENTRÉE
  // ============================================================
  getById: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = uuidParamSchema.parse(req.params.id);
    const log = await paymentAuditLogService.getById(id);
    res.status(200).json({ success: true, data: log });
  }),

  // ============================================================
  // HISTORIQUE D'UN PAIEMENT
  // ============================================================
  getByPaymentId: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const paymentId = z.coerce
        .number()
        .int()
        .positive()
        .parse(req.params.paymentId);
      const logs = await paymentAuditLogService.getByPaymentId(paymentId);
      res.status(200).json({ success: true, data: logs });
    },
  ),
};
