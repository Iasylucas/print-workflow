import { Request, Response } from "express";
import { catchAsync } from "@/utils/catchAsync.js";
import { assistantService } from "./assistant.service.js";
import { assistantQuerySchema } from "./assistant.schema.js";

export const assistantController = {
  ask: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { question, sessionId } = assistantQuerySchema.parse(req.body);

    // sub = id de l'utilisateur dans le JWT
    const userId = req.user.sub;
    const session = `${userId}:${sessionId ?? "default"}`;

    const result = await assistantService.ask(question, session);
    res.status(200).json({ success: true, data: result });
  }),
};
