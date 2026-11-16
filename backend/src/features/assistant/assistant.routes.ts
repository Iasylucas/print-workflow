import { Router } from "express";
import { protect } from "@/middlewares/auth.middleware.js";
import { assistantController } from "./assistant.controller.js";

const router: Router = Router();

router.use(protect);

/**
 * @desc    Poser une question à l'assistant
 * @route   POST /api/assistant/query
 * @access  Private
 */
router.post("/query", assistantController.ask);

export { router as assistantRoutes };
