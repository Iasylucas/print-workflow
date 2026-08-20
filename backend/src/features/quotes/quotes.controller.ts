import { Request, Response } from "express";
import { catchAsync } from "@/utils/catchAsync.js";
import { quotesService } from "./quotes.service.js";
import {
  quotesQuerySchema,
  updateQuoteSchema,
  quoteIdParamSchema,
} from "./quotes.schema.js";

export const quotesController = {
  listQuotes: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const query = quotesQuerySchema.parse(req.query);
    const result = await quotesService.listQuotes(query);
    res.status(200).json({ success: true, data: result });
  }),

  getQuoteById: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = quoteIdParamSchema.parse(req.params);
      const quote = await quotesService.getQuoteById(id);
      res.status(200).json({ success: true, data: quote });
    },
  ),

  updateQuote: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = quoteIdParamSchema.parse(req.params);
      const data = updateQuoteSchema.parse(req.body);
      const quote = await quotesService.updateQuote(id, data);
      res.status(200).json({
        success: true,
        message: "Devis mis à jour avec succès",
        data: quote,
      });
    },
  ),

  convertToInvoice: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = quoteIdParamSchema.parse(req.params);
      const userId = req.user!.sub;
      const result = await quotesService.convertToInvoice(id, userId);
      res.status(200).json({
        success: true,
        message: "Devis converti en facture avec succès",
        data: result,
      });
    },
  ),

  deleteQuote: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = quoteIdParamSchema.parse(req.params);
      await quotesService.softDeleteQuote(id);
      res.status(200).json({
        success: true,
        message: "Devis supprimé avec succès",
      });
    },
  ),

  restoreQuote: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = quoteIdParamSchema.parse(req.params);
      const quote = await quotesService.restoreQuote(id);
      res.status(200).json({
        success: true,
        message: "Devis restauré avec succès",
        data: quote,
      });
    },
  ),
};
