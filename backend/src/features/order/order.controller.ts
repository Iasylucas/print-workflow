import { Request, Response } from "express";
import { catchAsync } from "@/utils/catchAsync.js"; // Adaptez selon votre chemin exact de catchAsync
import { createBulkOrderSchema } from "./order.schema.js";
import { OrderService } from "./order.service.js";
import { OrderRepository } from "./order.repository.js";

// Instanciation locale décentralisée propre selon vos règles d'architecture (pas dans l'index)
const orderRepository = new OrderRepository();
const orderService = new OrderService(orderRepository);

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
};
