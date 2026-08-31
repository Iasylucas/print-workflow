import { Router } from "express";
import { protect, restrictTo } from "@/middlewares/auth.middleware.js";
import { companyInfoController } from "./company-info.controller.js";

const router: Router = Router();

/**
 * @desc    Get active company info
 * @route   GET /api/company-info
 * @access  Private (Admin only)
 */
router.get("/", companyInfoController.getActive);

router.use(protect);

router.use(restrictTo("ADMIN"));

/**
 * @desc    Get all company info versions
 * @route   GET /api/company-info/versions
 * @access  Private (Admin only)
 */
router.get("/versions", companyInfoController.getAllVersions);

/**
 * @desc    Get a specific company info version by ID
 * @route   GET /api/company-info/versions/:id
 * @access  Private (Admin only)
 */
router.get("/versions/:id", companyInfoController.getVersionById);

/**
 * @desc    Create a new company info version
 * @route   POST /api/company-info
 * @access  Private (Admin only)
 */
router.post("/", companyInfoController.createNewVersion);

export { router as companyInfoRoutes };
