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
      // 1. Barrière de sécurité HTTP : Validation stricte de la charge utile (payload) du POS via Zod v4
      const validatedData = createBulkOrderSchema.parse(req.body);

      // 2. Extraction sécurisée de l'ID du commercial/administrateur connecté via le token JWT
      const currentUserId = req.user!.sub;

      // 3. Orchestration de la logique métier (calcul séquentiel, vérification des prix, transaction)
      const result = await orderService.createBulkOrder(
        validatedData,
        currentUserId,
      );

      // 4. Envoi de la réponse uniforme standardisée conforme à vos pratiques ERP
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

  // order.controller.ts
  getOrderForPos: catchAsync(async (req: Request, res: Response) => {
    const { id } = orderIdParamSchema.parse(req.params);
    const order = await orderService.getOrderForPos(id);
    res.status(200).json({ success: true, data: order });
  }),

  // order.controller.ts
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
};
