// backend/src/features/orders/orders.controller.ts
import { Request, Response } from "express";
import { catchAsync } from "@/utils/catchAsync.js";
import { ordersService } from "./orders.service.js";
import {
  ordersQuerySchema,
  updateOrderSchema,
  updateOrderStatusSchema,
  addOrderNoteSchema,
  addOrderFileSchema,
  orderIdParamSchema,
} from "./orders.schema.js";

export const ordersController = {
  // Liste paginée des commandes
  listOrders: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const query = ordersQuerySchema.parse(req.query);
    const result = await ordersService.listOrders(query);
    res.status(200).json({ success: true, data: result });
  }),

  // Détail d'une commande
  getOrderById: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = orderIdParamSchema.parse(req.params);
      const order = await ordersService.getOrderById(id);
      res.status(200).json({ success: true, data: order });
    },
  ),

  // Mise à jour partielle d'une commande
  updateOrder: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = orderIdParamSchema.parse(req.params);
      const validated = updateOrderSchema.parse(req.body);
      const order = await ordersService.updateOrder(id, validated);
      res.status(200).json({
        success: true,
        message: "Commande mise à jour avec succès",
        data: order,
      });
    },
  ),

  // Mise à jour du statut
  updateOrderStatus: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = orderIdParamSchema.parse(req.params);
      const validated = updateOrderStatusSchema.parse(req.body);
      const order = await ordersService.updateOrderStatus(id, validated);
      res.status(200).json({
        success: true,
        message: "Statut mis à jour avec succès",
        data: order,
      });
    },
  ),

  // Ajout d'une note
  addNote: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = orderIdParamSchema.parse(req.params);
    const userId = req.user!.sub;
    const validated = addOrderNoteSchema.parse(req.body);
    const note = await ordersService.addNote(id, userId, validated);
    res.status(201).json({
      success: true,
      message: "Note ajoutée avec succès",
      data: note,
    });
  }),

  // Ajout d'un fichier
  addFile: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = orderIdParamSchema.parse(req.params);
    const userId = req.user!.sub;
    const validated = addOrderFileSchema.parse(req.body);
    const file = await ordersService.addFile(id, userId, validated);
    res.status(201).json({
      success: true,
      message: "Fichier ajouté avec succès",
      data: file,
    });
  }),

  // Suppression d'une note
  deleteNote: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const noteId = orderIdParamSchema.parse(req.params).id;
    const userId = req.user!.sub;
    const userRole = req.user!.role;
    await ordersService.deleteNote(noteId, userId, userRole);
    res.status(200).json({
      success: true,
      message: "Note supprimée avec succès",
    });
  }),

  // Suppression d'un fichier
  deleteFile: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const fileId = orderIdParamSchema.parse(req.params).id;
    const userId = req.user!.sub;
    const userRole = req.user!.role;
    await ordersService.deleteFile(fileId, userId, userRole);
    res.status(200).json({
      success: true,
      message: "Fichier supprimé avec succès",
    });
  }),
};
