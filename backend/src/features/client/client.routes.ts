import { Router } from "express";
import { clientControllerWrapped } from "./client.controller.js";
import { protect, restrictTo } from "@/middlewares/auth.middleware.js";

const router: Router = Router();

// Protect all client routes: only ADMIN and SALES
router.use(protect, restrictTo("ADMIN", "SALES"));

router.post("/", clientControllerWrapped.create);
router.get("/", clientControllerWrapped.list);
router.get("/:id", clientControllerWrapped.getById);
router.patch("/:id", clientControllerWrapped.update);
router.delete("/:id", clientControllerWrapped.remove);

export { router as clientRoutes };
