import { Router } from "express";
import { protect, restrictTo } from "@/middlewares/auth.middleware.js";
import { quotesController } from "./quotes.controller.js";

const router: Router = Router();

router.use(protect, restrictTo("ADMIN", "SALES"));

/**
 * @desc    List quotes with pagination, search and filters
 * @route   GET /api/quotes
 * @access  Private (All authenticated users)
 */
router.get("/", quotesController.listQuotes);

/**
 * @desc    Get quote by ID (with orders)
 * @route   GET /api/quotes/:id
 * @access  Private (All authenticated users)
 */
router.get("/:id", quotesController.getQuoteById);

/**
 * @desc    Update quote (status)
 * @route   PATCH /api/quotes/:id
 * @access  Private (All authenticated users)
 */
router.patch("/:id", quotesController.updateQuote);

/**
 * @desc    Convert a quote to an invoice
 * @route   POST /api/quotes/:id/convert
 * @access  Private (All authenticated users)
 */
router.post("/:id/convert", quotesController.convertToInvoice);

/**
 * @desc    Soft delete a quote
 * @route   DELETE /api/quotes/:id
 * @access  Private (All authenticated users)
 */
router.delete("/:id", quotesController.deleteQuote);

/**
 * @desc    Restore a soft deleted quote
 * @route   PATCH /api/quotes/:id/restore
 * @access  Private (All authenticated users)
 */
router.patch("/:id/restore", quotesController.restoreQuote);

export { router as quotesRoutes };
