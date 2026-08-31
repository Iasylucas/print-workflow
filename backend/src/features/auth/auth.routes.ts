import { Router } from "express";
import { authController } from "./auth.controller.js";
import { protect, restrictTo } from "@/middlewares/auth.middleware.js";
import { authLimiter } from "@/middlewares/rateLimiter.middleware.js";

const router: Router = Router();

/**
 * @desc    Classic authentication
 * @route   POST /api/auth/login
 * @access  Public
 */
router.post("/login", authLimiter, authController.login);

/**
 * @desc    Get current user profile (Session validation)
 * @route   GET /api/auth/me
 * @access  Private (Authenticated users)
 */
router.get("/me", protect, authController.getMe);

/**
 * @desc    Admin action: Invite a new collaborator
 * @route   POST /api/auth/invite
 * @access  Private (Admin only)
 */
router.post("/invite", protect, restrictTo("ADMIN"), authController.invite);

/**
 * @desc    Finalisation of the registration via token
 * @route   POST /api/auth/finalize
 * @access  Public (Verified by token in the body)
 */
router.post("/finalize", authController.finalize);

/**
 * @desc    Change password for logged-in users
 * @route   POST /api/auth/change-password
 * @access  Private (Authenticated users)
 */
router.post("/change-password", protect, authController.changePassword);

/**
 * @desc    Forgot password - Request reset link
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
router.post("/forgot-password", authLimiter, authController.forgotPassword);

/**
 * @desc    Reset password using token
 * @route   POST /api/auth/reset-password
 * @access  Public (Verified by token in the body)
 */
router.post("/reset-password", authLimiter, authController.resetPassword);

/**
 * @desc    Confirm email change using token
 * @route   POST /api/auth/confirm-email-change
 * @access  Public (Verified by token in the body)
 */
router.post("/confirm-email-change", authController.confirmEmailChange);

export { router as authRoutes };
