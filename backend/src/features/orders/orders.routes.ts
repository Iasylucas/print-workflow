// backend/src/features/orders/orders.routes.ts
import { Router } from "express";
import { protect, restrictTo } from "@/middlewares/auth.middleware.js";
import { ordersController } from "./orders.controller.js";

const router: Router = Router();

// Protect all orders routes
router.use(protect);

/**
 * @desc    List orders with pagination, search and filters
 * @route   GET /api/orders
 * @access  Private (All authenticated users)
 */
router.get("/", ordersController.listOrders);

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private (All authenticated users)
 */
router.get("/:id", ordersController.getOrderById);

/**
 * @desc    Update order (designation, label, dimensions, quantity, unitPrice)
 * @route   PATCH /api/orders/:id
 * @access  Private (All authenticated users)
 */
router.patch("/:id", ordersController.updateOrder);

/**
 * @desc    Update order status
 * @route   PATCH /api/orders/:id/status
 * @access  Private (All authenticated users)
 */
router.patch("/:id/status", ordersController.updateOrderStatus);

/**
 * @desc    Add a note to an order
 * @route   POST /api/orders/:id/notes
 * @access  Private (All authenticated users)
 */
router.post("/:id/notes", ordersController.addNote);

/**
 * @desc    Delete a note
 * @route   DELETE /api/orders/notes/:id
 * @access  Private (All authenticated users)
 */
router.delete("/notes/:id", ordersController.deleteNote);

/**
 * @desc    Add a file to an order
 * @route   POST /api/orders/:id/files
 * @access  Private (All authenticated users)
 */
router.post("/:id/files", ordersController.addFile);

/**
 * @desc    Delete a file
 * @route   DELETE /api/orders/files/:id
 * @access  Private (All authenticated users)
 */
router.delete("/files/:id", ordersController.deleteFile);

export default router;
