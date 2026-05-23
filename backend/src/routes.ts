import { Router } from "express";
import { authRoutes } from "./features/auth/auth.routes.js";
import { clientRoutes } from "./features/client/client.routes.js";
import { companyInfoRoutes } from "./features/company-info/index.js";
import { userRoutes } from "./features/user/index.js";

const router: Router = Router();

// Mounting the auth routes under /api/auth
router.use("/auth", authRoutes);
// Mounting the client routes under /api/clients
router.use("/clients", clientRoutes);
// Mounting the company info routes under /api/company-info
router.use("/company-info", companyInfoRoutes);
// Mounting the user routes under /api/users
router.use("/users", userRoutes);

export default router;
