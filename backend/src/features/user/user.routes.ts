import { Router } from "express";
import { protect, restrictTo } from "@/middlewares/auth.middleware.js";
import { userController } from "./user.controller.js";

const router: Router = Router();

// Routes protégées (authentification requise)
router.use(protect);

// ROUTE ACCESSIBLE À TOUS LES UTILISATEURS AUTHENTIFIÉS
/**
 * @desc    Get my profile *
 * @route   GET /api/users/me
 * @access  Private (Authenticated users)
 */
router.get("/me", userController.getMyProfile);

/**
 * @desc    Update my profile
 * @route   PATCH /api/users/me
 * @access  Private (Authenticated users)
 */
router.patch("/me", userController.updateMyProfile);

// ROUTES RESERVE A L ADMIN (gestion des utilisateurs)
/**
 * @desc    List active invitations
 * @route   GET /api/users/invitations
 * @access  Private (Admin users)
 */
router.get("/invitations", restrictTo("ADMIN"), userController.listInvitations);

/**
 * @desc    Cancel an invitation
 * @route   DELETE /api/users/invitations/:id
 * @access  Private (Admin users)
 */
router.delete(
  "/invitations/:id",
  restrictTo("ADMIN"),
  userController.cancelInvitation,
);
/**
 * @desc    List users
 * @route   GET /api/users
 * @access  Private (Admin users)
 */
router.get("/", restrictTo("ADMIN"), userController.listUsers);

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private (Admin users)
 */
router.get("/:id", restrictTo("ADMIN"), userController.getUserById);

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private (Admin users)
 */

router.put("/:id", restrictTo("ADMIN"), userController.updateUser);

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private (Admin users)
 */
router.delete("/:id", restrictTo("ADMIN"), userController.deleteUser);

/**
 * @desc    Initiate email change
 * @route   PUT /api/users/:id/email
 * @access  Private (Admin users)
 */
router.put(
  "/:id/email",
  restrictTo("ADMIN"),
  userController.initiateEmailChange,
);

export { router as userRoutes };
