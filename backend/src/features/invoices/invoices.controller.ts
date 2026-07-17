// backend/src/features/invoices/invoices.controller.ts
import { Request, Response } from "express";
import { catchAsync } from "@/utils/catchAsync.js";
import { invoicesService } from "./invoices.service.js";
import {
  invoicesQuerySchema,
  updateInvoiceSchema,
  markInvoiceDeliveredSchema,
  addPaymentSchema,
  invoiceIdParamSchema,
  paymentIdParamSchema,
} from "./invoices.schema.js";

export const invoicesController = {
  // ============================================================
  // LISTE PAGINÉE DES FACTURES
  // ============================================================
  listInvoices: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const query = invoicesQuerySchema.parse(req.query);
      const result = await invoicesService.listInvoices(query);
      res.status(200).json({ success: true, data: result });
    },
  ),

  // ============================================================
  // DÉTAIL D'UNE FACTURE
  // ============================================================
  getInvoiceById: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = invoiceIdParamSchema.parse(req.params);
      const invoice = await invoicesService.getInvoiceById(id);
      res.status(200).json({ success: true, data: invoice });
    },
  ),

  // ============================================================
  // MISE À JOUR PARTIELLE D'UNE FACTURE
  // ============================================================
  updateInvoice: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = invoiceIdParamSchema.parse(req.params);
      const data = updateInvoiceSchema.parse(req.body);
      const invoice = await invoicesService.updateInvoice(id, data);
      res.status(200).json({
        success: true,
        message: "Facture mise à jour avec succès",
        data: invoice,
      });
    },
  ),

  // ============================================================
  // MARQUER COMME LIVRÉE (propagation aux commandes)
  // ============================================================
  markAsDelivered: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = invoiceIdParamSchema.parse(req.params);
      const { isDelivered } = markInvoiceDeliveredSchema.parse(req.body);
      const invoice = await invoicesService.markAsDelivered(id);
      res.status(200).json({
        success: true,
        message: `Facture ${isDelivered ? "livrée" : "non livrée"} avec succès`,
        data: invoice,
      });
    },
  ),

  // ============================================================
  // AJOUT D'UN PAIEMENT
  // ============================================================
  addPayment: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = invoiceIdParamSchema.parse(req.params);
    const userId = req.user!.sub;
    const data = addPaymentSchema.parse(req.body);
    const payment = await invoicesService.addPayment(id, userId, data);
    res.status(201).json({
      success: true,
      message: "Paiement ajouté avec succès",
      data: payment,
    });
  }),

  // ============================================================
  // SUPPRESSION D'UN PAIEMENT
  // ============================================================
  deletePayment: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { paymentId } = paymentIdParamSchema.parse(req.params);
      await invoicesService.deletePayment(paymentId);
      res.status(200).json({
        success: true,
        message: "Paiement supprimé avec succès",
      });
    },
  ),

  // ============================================================
  // SOFT DELETE D'UNE FACTURE
  // ============================================================
  deleteInvoice: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = invoiceIdParamSchema.parse(req.params);
      await invoicesService.softDeleteInvoice(id);
      res.status(200).json({
        success: true,
        message: "Facture supprimée avec succès",
      });
    },
  ),

  // ============================================================
  // RESTAURER UNE FACTURE
  // ============================================================
  restoreInvoice: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = invoiceIdParamSchema.parse(req.params);
      const invoice = await invoicesService.restoreInvoice(id);
      res.status(200).json({
        success: true,
        message: "Facture restaurée avec succès",
        data: invoice,
      });
    },
  ),
};
