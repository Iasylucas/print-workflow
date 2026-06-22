import { Router } from "express";
import { authRoutes } from "./features/auth/auth.routes.js";
import { clientRoutes } from "./features/client/client.routes.js";
import { companyInfoRoutes } from "./features/company-info/index.js";
import { userRoutes } from "./features/user/index.js";
import { cloudinaryRoutes } from "./features/cloudinary/cloudinary.routes.js";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/clients", clientRoutes);
router.use("/company-info", companyInfoRoutes);
router.use("/users", userRoutes);
router.use("/cloudinary", cloudinaryRoutes);

export default router;
