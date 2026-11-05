import { Router } from "express";
import { orderController } from "./order.controller.js";
import { protect, restrictTo } from "@/middlewares/auth.middleware.js";

const router: Router = Router();
router.use(protect);

router.post(
  "/bulk",
  restrictTo("ADMIN", "SALES"),
  orderController.createBulkOrder,
);

router.patch("/:id/", orderController.updateOrderFromPos);

router.get("/invoice/:id", orderController.getInvoiceForPos);

router.get("/invoice/:id/payments", orderController.getInvoicePaymentsForPos);

export default router;
