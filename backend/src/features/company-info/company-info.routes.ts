import { Router } from "express";
import { protect, restrictTo } from "@/middlewares/auth.middleware.js";
import { companyInfoControllerWrapped } from "./company-info.controller.js";

const router: Router = Router();

router.use(protect);
router.use(restrictTo("ADMIN"));

router.get("/", companyInfoControllerWrapped.getActive);
router.get("/versions", companyInfoControllerWrapped.getAllVersions);
router.get("/versions/:id", companyInfoControllerWrapped.getVersionById);
router.post("/", companyInfoControllerWrapped.createNewVersion);

export { router as companyInfoRoutes };
