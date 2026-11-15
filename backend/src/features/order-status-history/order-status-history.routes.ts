import { Router } from "express";
import { protect } from "@/middlewares/auth.middleware.js";
import { orderStatusHistoryController } from "./order-status-history.controller.js";

const router: Router = Router();

router.use(protect);

/**
 * @desc    Lister l'historique des changements de statut (pagination, filtres)
 * @route   GET /api/order-status-history
 * @access  Private
 */
router.get("/", orderStatusHistoryController.list);

/**
 * @desc    Historique d'une commande spécifique
 * @route   GET /api/order-status-history/order/:orderId
 * @access  Private
 */
router.get("/order/:orderId", orderStatusHistoryController.getByOrderId);

/**
 * @desc    Détail d'une entrée d'historique
 * @route   GET /api/order-status-history/:id
 * @access  Private
 */
router.get("/:id", orderStatusHistoryController.getById);

export { router as orderStatusHistoryRoutes };