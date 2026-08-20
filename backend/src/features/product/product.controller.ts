import { Request, Response } from "express";
import { catchAsync } from "@/utils/catchAsync.js";
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from "./product.schema.js";
import { z } from "zod";
import { productService } from "./product.service.js";

const intIdSchema = z.coerce
  .number()
  .int()
  .positive("L'identifiant doit être un entier valide");

export const productController = {
  createProduct: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const validatedData = createProductSchema.parse(req.body);

      const result = await productService.createProduct(validatedData);

      res.status(201).json({
        success: true,
        message: "Produit et grille tarifaire créés avec succès",
        data: result,
      });
    },
  ),

  getProductById: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const id = intIdSchema.parse(req.params.id);

      const product = await productService.getProductById(id);

      res.status(200).json({
        success: true,
        data: product,
      });
    },
  ),

  listProducts: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const query = productQuerySchema.parse(req.query);

      const result = await productService.listProducts(query);

      res.status(200).json({
        success: true,
        data: result,
      });
    },
  ),

  updateProduct: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const id = intIdSchema.parse(req.params.id);
      const validatedData = updateProductSchema.parse(req.body);

      const updatedProduct = await productService.updateProduct(
        id,
        validatedData,
      );

      res.status(200).json({
        success: true,
        message: "Grille tarifaire mise à jour avec succès",
        data: updatedProduct,
      });
    },
  ),

  deleteProduct: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const id = intIdSchema.parse(req.params.id);

      await productService.deleteProduct(id);

      res.status(200).json({
        success: true,
        message: "Le produit a été définitivement retiré du catalogue",
      });
    },
  ),
};
