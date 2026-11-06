import { Router } from "express";
import { protect, restrictTo } from "@/middlewares/auth.middleware.js";
import { paymentAuditLogController } from "./payment-audit-log.controller.js";

const router: Router = Router();

router.use(protect);

// ============================================================
// ROUTES ADMIN UNIQUEMENT
// ============================================================
router.use(restrictTo("ADMIN"));

/**
 * @desc    Lister l'historique des audits de paiement (pagination, filtres)
 * @route   GET /api/payment-audit-logs
 * @access  Private (Admin only)
 */
router.get("/", paymentAuditLogController.list);

/**
 * @desc    Obtenir une entrée d'audit par son ID
 * @route   GET /api/payment-audit-logs/:id
 * @access  Private (Admin only)
 */
router.get("/:id", paymentAuditLogController.getById);

/**
 * @desc    Historique des audits d'un paiement spécifique
 * @route   GET /api/payment-audit-logs/payment/:paymentId
 * @access  Private (Admin only)
 */
router.get("/payment/:paymentId", paymentAuditLogController.getByPaymentId);

export { router as paymentAuditLogRoutes };
