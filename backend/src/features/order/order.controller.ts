import { Request, Response } from "express";
import { catchAsync } from "@/utils/catchAsync.js"; // Adaptez selon votre chemin exact de catchAsync
import {
  createBulkOrderSchema,
  updateOrderFromPosSchema,
} from "./order.schema.js";
import { OrderService } from "./order.service.js";
import { OrderRepository } from "./order.repository.js";
import { orderIdParamSchema } from "../orders/orders.schema.js";
import { invoiceIdParamSchema } from "../invoices/invoices.schema.js";
import { orderService } from "./order.service.js";

export const orderController = {
  /**
   * @desc    Créer et valider un panier complet de commandes depuis le POS (Bulk)
   * @route   POST /api/orders/bulk
   * @access  Private (Admin & Sales)
   */
  createBulkOrder: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const validatedData = createBulkOrderSchema.parse(req.body);

      const currentUserId = req.user!.sub;

      const result = await orderService.createBulkOrder(
        validatedData,
        currentUserId,
      );

      res.status(201).json({
        success: true,
        message:
          result.documentType === "INVOICE"
            ? "La facture a été émise et les lignes de fabrication envoyées à l'atelier"
            : "Le devis a été enregistré avec succès",
        data: result,
      });
    },
  ),

  getOrderForPos: catchAsync(async (req: Request, res: Response) => {
    const { id } = orderIdParamSchema.parse(req.params);
    const order = await orderService.getOrderForPos(id);
    res.status(200).json({ success: true, data: order });
  }),

  updateOrderFromPos: catchAsync(async (req: Request, res: Response) => {
    const { id } = invoiceIdParamSchema.parse(req.params);
    const userId = req.user!.sub;
    const data = updateOrderFromPosSchema.parse(req.body);

    const result = await orderService.updateOrderFromPos(id, data, userId);

    res.status(200).json({
      success: true,
      message: "Commande mise à jour avec succès",
      data: result,
    });
  }),

  getInvoiceForPos: catchAsync(async (req: Request, res: Response) => {
    const { id } = invoiceIdParamSchema.parse(req.params);
    const invoice = await orderService.getInvoiceForPos(id);
    res.json({ success: true, data: invoice });
  }),

  getInvoicePaymentsForPos: catchAsync(async (req: Request, res: Response) => {
    const { id } = invoiceIdParamSchema.parse(req.params);
    const invoice = await orderService.getInvoicePaymentsForPos(id);
    res.json({ success: true, data: invoice });
  }),
};
