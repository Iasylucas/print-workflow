import { Router } from "express";
import { protect, restrictTo } from "@/middlewares/auth.middleware.js";
import { dashboardController } from "./dashboard.controller.js";

const router: Router = Router();

router.use(protect);
router.use(restrictTo("ADMIN"));

/**
 * @desc    Statistiques globales du tableau de bord
 * @route   GET /api/dashboard/stats
 * @access  Private (Admin only)
 */
router.get("/stats", dashboardController.getStats);

/**
 * @desc    Tendance des encaissements sur les 6 derniers mois
 * @route   GET /api/dashboard/payments-trend
 * @access  Private (Admin only)
 */
router.get("/payments-trend", dashboardController.getPaymentsTrend);

export { router as dashboardRoutes };