import { Router } from "express";
import { authRoutes } from "./features/auth/auth.routes.js";
import { clientRoutes } from "./features/client/client.routes.js";
import { companyInfoRoutes } from "./features/company-info/index.js";
import { userRoutes } from "./features/user/index.js";
import { cloudinaryRoutes } from "./features/cloudinary/cloudinary.routes.js";
import { productRoutes } from "./features/product/index.js";
import { orderRoutes } from "./features/order/index.js";
import { ordersRoutes } from "./features/orders/index.js";
import { invoicesRoutes } from "./features/invoices/invoices.routes.js";
import { quotesRoutes } from "./features/quotes/quotes.routes.js";
import { standardLimiter } from "./middlewares/rateLimiter.middleware.js";

const router: Router = Router();

router.use("/auth", authRoutes);

router.use("/clients", standardLimiter, clientRoutes);
router.use("/company-info", standardLimiter, companyInfoRoutes);
router.use("/users", standardLimiter, userRoutes);
router.use("/cloudinary", standardLimiter, cloudinaryRoutes);
router.use("/products", standardLimiter, productRoutes);
router.use("/pos", standardLimiter, orderRoutes);
router.use("/orders", standardLimiter, ordersRoutes);
router.use("/invoices", standardLimiter, invoicesRoutes);
router.use("/quotes", standardLimiter, quotesRoutes);

export default router;
