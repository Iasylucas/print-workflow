import { Request, Response } from "express";
import { catchAsync } from "@/utils/catchAsync.js"; // Adaptez selon votre
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from "./product.schema.js";
import { z } from "zod";
import { productService } from "./product.service.js";

// Schéma de validation rapide et strict pour les ID séquentiels de type Int
const intIdSchema = z.coerce
  .number()
  .int()
  .positive("L'identifiant doit être un entier valide");

export const productController = {
  // 1. Créer un produit complet (Admin)
  createProduct: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      // Validation du corps de la requête (Le slug est automatiquement exclu car géré par le Service)
      const validatedData = createProductSchema.parse(req.body);

      // Appel de la couche métier
      const result = await productService.createProduct(validatedData);

      // Réponse standardisée
      res.status(201).json({
        success: true,
        message: "Produit et grille tarifaire créés avec succès",
        data: result,
      });
    },
  ),

  // 2. Récupérer un produit spécifique par son ID (Admin & POS Commercial)
  getProductById: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      // Conversion et validation de l'ID reçu dans les paramètres de l'URL
      const id = intIdSchema.parse(req.params.id);

      const product = await productService.getProductById(id);

      res.status(200).json({
        success: true,
        data: product,
      });
    },
  ),

  // 3. Lister les produits avec filtres, recherche et pagination (Admin & POS Commercial)
  listProducts: catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      // Décodage et validation automatique des query params (?page=1&limit=20&search=vynile)
      const query = productQuerySchema.parse(req.query);

      const result = await productService.listProducts(query);

      res.status(200).json({
        success: true,
        data: result,
      });
    },
  ),

  // 4. Mettre à jour un produit et ses variantes (Admin)
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

  // 5. Supprimer un produit et ses déclinaisons techniques (Admin)
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
