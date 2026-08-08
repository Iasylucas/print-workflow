import { Router } from "express";
import { cloudinaryController } from "./cloudinary.controller.js";

const router: Router = Router();

router.post("/signature", cloudinaryController.generateSignature);

router.delete("/image", cloudinaryController.deleteImage);

export { router as cloudinaryRoutes };
