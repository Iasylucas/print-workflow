import { Router } from "express";
import { protect, restrictTo } from "@/middlewares/auth.middleware.js";
import { cloudinaryController } from "./cloudinary.controller.js";

const router: Router = Router();

router.use(protect);

router.post(
  "/signature",
  restrictTo("ADMIN"),
  cloudinaryController.generateSignature,
);

export { router as cloudinaryRoutes };
