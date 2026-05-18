import { Router } from "express";
import { authController } from "./auth.controller.js";
import { protect, restrictTo } from "@/middlewares/auth.middleware.js";
import { catchAsync } from "@/utils/catchAsync.js";

const router: Router = Router();

/**
 * @desc    Classic authentication
 * @route   POST /api/auth/login
 * @access  Public
 */
router.post("/login", catchAsync(authController.login));

/**
 * @desc    Admin action: Invite a new collaborator
 * @route   POST /api/auth/invite
 * @access  Private (Admin only)
 */
router.post(
  "/invite",
  protect,
  restrictTo("ADMIN"),
  catchAsync(authController.invite),
);

/**
 * @desc    Finalisation of the registration via token
 * @route   POST /api/auth/finalize
 * @access  Public (Verified by token in the body)
 */
router.post("/finalize", catchAsync(authController.finalize));

export { router as authRoutes };
