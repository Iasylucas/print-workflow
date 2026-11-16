import { Request, Response } from "express";
import { catchAsync } from "@/utils/catchAsync.js";
import { assistantService } from "./assistant.service.js";
import { assistantQuerySchema } from "./assistant.schema.js";

export const assistantController = {
  ask: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { question } = assistantQuerySchema.parse(req.body);
    const result = await assistantService.ask(question);
    res.status(200).json({ success: true, data: result });
  }),
};
