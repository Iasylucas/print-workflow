import { Router } from "express";
import { protect } from "@/middlewares/auth.middleware.js";
import { notificationsController } from "./notifications.controller.js";

const router: Router = Router();

router.use(protect);

/**
 * @desc    Compter les notifications non lues (polling)
 * @route   GET /api/notifications/unread-count
 * @access  Private
 */
router.get("/unread-count", notificationsController.getUnreadCount);

/**
 * @desc    Lister les notifications de l'utilisateur connecté
 * @route   GET /api/notifications
 * @access  Private
 */
router.get("/", notificationsController.list);

/**
 * @desc    Marquer toutes les notifications comme lues
 * @route   PATCH /api/notifications/read-all
 * @access  Private
 */
router.patch("/read-all", notificationsController.markAllAsRead);

/**
 * @desc    Marquer une notification comme lue
 * @route   PATCH /api/notifications/:id/read
 * @access  Private
 */
router.patch("/:id/read", notificationsController.markAsRead);

/**
 * @desc    Supprimer une notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
router.delete("/:id", notificationsController.delete);

export { router as notificationsRoutes };