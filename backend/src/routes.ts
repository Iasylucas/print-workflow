import { Router } from "express";
import { authRoutes } from "./features/auth/auth.routes.js";

const router: Router = Router();

// Mounting the auth routes under /api/auth
router.use("/auth", authRoutes);

export default router;
