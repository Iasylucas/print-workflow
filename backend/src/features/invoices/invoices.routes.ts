// backend/src/features/invoices/invoices.routes.ts
import { Router } from "express";
import { protect, restrictTo } from "@/middlewares/auth.middleware.js";
import { invoicesController } from "./invoices.controller.js";

const router: Router = Router();

router.use(protect);

/**
 * @desc    List invoices with pagination, search and filters
 * @route   GET /api/invoices
 * @access  Private (All authenticated users)
 */
router.get("/", invoicesController.listInvoices);

/**
 * @desc    Get invoice by ID (with orders and payments)
 * @route   GET /api/invoices/:id
 * @access  Private (All authenticated users)
 */
router.get("/:id", invoicesController.getInvoiceById);

/**
 * @desc    Update invoice (deposit, deliveryPlace, expectedDeliveryDate)
 * @route   PATCH /api/invoices/:id
 * @access  Private (All authenticated users)
 */
router.patch("/:id", invoicesController.updateInvoice);

/**
 * @desc    Mark invoice as delivered (propagates to orders)
 * @route   PATCH /api/invoices/:id/deliver
 * @access  Private (All authenticated users)
 */
router.patch("/:id/deliver", invoicesController.markAsDelivered);

/**
 * @desc    Add a payment to an invoice
 * @route   POST /api/invoices/:id/payments
 * @access  Private (All authenticated users)
 */
router.post(
  "/:id/payments",
  restrictTo("ADMIN"),
  invoicesController.addPayment,
);

/**
 * @desc    Delete a payment
 * @route   DELETE /api/invoices/payments/:paymentId
 * @access  Private (All authenticated users)
 */
router.delete("/payments/:paymentId", invoicesController.deletePayment);

/**
 * @desc    Soft delete an invoice
 * @route   DELETE /api/invoices/:id
 * @access  Private (All authenticated users)
 */
router.delete("/:id", invoicesController.deleteInvoice);

/**
 * @desc    Restore a soft deleted invoice
 * @route   PATCH /api/invoices/:id/restore
 * @access  Private (All authenticated users)
 */
router.patch("/:id/restore", invoicesController.restoreInvoice);

export { router as invoicesRoutes };
