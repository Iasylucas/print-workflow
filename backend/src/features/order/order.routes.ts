import { Router } from "express";
import { orderController } from "./order.controller.js";
import { protect, restrictTo } from "@/middlewares/auth.middleware.js";

const router: Router = Router();
router.use(protect);
/**
 * @desc    Créer et valider un panier de commandes en masse (Bulk) depuis le POS
 * @route   POST /api/orders/bulk
 * @access  Private (Strictement réservé aux ADMINISTRATEURS et COMMERCIAUX)
 */
router.post(
  "/bulk",
  restrictTo("ADMIN", "SALES"),
  orderController.createBulkOrder,
);

// order.routes.ts
router.get("/:id/pos", orderController.getOrderForPos);
// order.routes.ts
router.patch("/:id/pos", orderController.updateOrderFromPos);

export default router;
