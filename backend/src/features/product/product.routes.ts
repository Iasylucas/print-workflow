import { Router } from "express";
import { productController } from "./product.controller.js";
import { protect, restrictTo } from "@/middlewares/auth.middleware.js"; // Adaptez selon votre chemin exact

const router: Router = Router();

router.use(protect);

// =========================================================================
// ROUTES ACCESSIBLES PAR TOUS LES COLLABORATEURS CONNECTÉS (ADMIN & COMMERCIAL POS)
// =========================================================================

/**
 * @desc    Lister les produits du catalogue (avec pagination, filtres et recherche)
 * @route   GET /api/products
 * @access  Private (Collaborateurs connectés)
 */
router.get("/", productController.listProducts);

/**
 * @desc    Récupérer les détails d'un produit spécifique par son ID
 * @route   GET /api/products/:id
 * @access  Private (Collaborateurs connectés)
 */
router.get("/:id", productController.getProductById);

// =========================================================================
// ROUTES STRICTEMENT RÉSERVÉES À L'ADMINISTRATEUR (GESTION DU CATALOGUE)
// =========================================================================

/**
 * @desc    Créer un nouveau produit complet avec ses variantes et grilles de prix
 * @route   POST /api/products
 * @access  Private (Admin uniquement)
 */
router.post("/", restrictTo("ADMIN"), productController.createProduct);

/**
 * @desc    Mettre à jour un produit et synchroniser sa grille tarifaire JSON
 * @route   PUT /api/products/:id
 * @access  Private (Admin uniquement)
 */
router.put("/:id", restrictTo("ADMIN"), productController.updateProduct);

/**
 * @desc    Supprimer définitivement un produit et ses déclinaisons du catalogue
 * @route   DELETE /api/products/:id
 * @access  Private (Admin uniquement)
 */
router.delete("/:id", restrictTo("ADMIN"), productController.deleteProduct);

export { router as productRoutes };
