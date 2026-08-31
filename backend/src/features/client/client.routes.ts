import { Router } from "express";
import { clientController } from "./client.controller.js";
import { protect, restrictTo } from "@/middlewares/auth.middleware.js";

const router: Router = Router();

router.use(protect, restrictTo("ADMIN", "SALES"));

/**
 * @desc    Create a new client
 * @route   POST /api/clients
 * @access  Private (Admin and Sales)
 */
router.post("/", clientController.create);

/**
 * @desc    List clients with pagination, search and sorting
 * @route   GET /api/clients
 * @access  Private (Admin and Sales)
 */
router.get("/", clientController.list);

/**
 * @desc    Get a client by ID
 * @route   GET /api/clients/:id
 * @access  Private (Admin and Sales)
 */
router.get("/:id", clientController.getById);

/**
 * @desc    Update a client by ID
 * @route   PATCH /api/clients/:id
 * @access  Private (Admin and Sales)
 */
router.patch("/:id", clientController.update);

/**
 * @desc    Soft delete a client by ID
 * @route   DELETE /api/clients/:id
 * @access  Private (Admin and Sales)
 */
router.delete("/:id", clientController.remove);

export { router as clientRoutes };
