import { Router } from "express";
import { authControllerWrapped } from "./auth.controller.js";
import { protect, restrictTo } from "@/middlewares/auth.middleware.js";

const router: Router = Router();

/**
 * @desc    Classic authentication
 * @route   POST /api/auth/login
 * @access  Public
 */
router.post("/login", authControllerWrapped.login);

/**
 * @desc    Admin action: Invite a new collaborator
 * @route   POST /api/auth/invite
 * @access  Private (Admin only)
 */
router.post(
  "/invite",
  protect,
  restrictTo("ADMIN"),
  authControllerWrapped.invite,
);

/**
 * @desc    Finalisation of the registration via token
 * @route   POST /api/auth/finalize
 * @access  Public (Verified by token in the body)
 */
router.post("/finalize", authControllerWrapped.finalize);

/**
 * @desc    Change password for logged-in users
 * @route   POST /api/auth/change-password
 * @access  Private (Authenticated users)
 */
router.post("/change-password", protect, authControllerWrapped.changePassword);

/**
 * @desc    Forgot password - Request reset link
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
router.post("/forgot-password", authControllerWrapped.forgotPassword);

/**
 * @desc    Reset password using token
 * @route   POST /api/auth/reset-password
 * @access  Public (Verified by token in the body)
 */
router.post("/reset-password", authControllerWrapped.resetPassword);

export { router as authRoutes };
