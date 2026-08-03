import { ProductRepository } from "./product.repository.js";
import {
  CreateProductInput,
  UpdateProductInput,
  ProductQuery,
  FullProductOutput,
} from "./product.types.js";
import {
  ConflictError,
  NotFoundError,
  InternalServerError,
} from "@/shared/error/error.js"; // Adaptez selon votre arborescence d'erreurs
import { prisma } from "@/config/prisma.js";
import { Prisma } from "@/generated/prisma/client.js";

export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  // 1. Fonction utilitaire privée pour générer un slug propre (Standard Pro)
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .normalize("NFD") // Sépare les caractères de leurs accents
      .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
      .replace(/[^a-z0-9\s-]/g, "") // Enlève tout ce qui n'est pas lettre, chiffre ou espace
      .replace(/[\s_]+/g, "-") // Remplace les espaces et underscores par des tirets
      .replace(/-+/g, "-"); // Évite les tirets consécutifs (ex: --)
  }

  // 2. Créer un produit complet (Admin)
  async createProduct(data: CreateProductInput): Promise<FullProductOutput> {
    const slug = this.generateSlug(data.name);

    // Vérification de l'unicité du slug pour éviter les doublons en BDD
    const existingProduct = await this.productRepository.findBySlug(slug);
    if (existingProduct) {
      throw new ConflictError(
        "Un produit portant ce nom ou ce slug existe déjà.",
      );
    }

    try {
      const product = await this.productRepository.create(data, slug);
      return product as unknown as FullProductOutput;
    } catch (error) {
      throw new InternalServerError("Échec de la création du produit.");
    }
  }

  // 3. Récupérer un produit par son ID
  async getProductById(id: number): Promise<FullProductOutput> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundError("Le produit demandé n'existe pas.");
    }
    return product as unknown as FullProductOutput;
  }

  // 4. Lister les produits (Admin & POS Commercial)
  async listProducts(query: ProductQuery) {
    return await this.productRepository.findAll(query);
  }

  // 5. Supprimer un produit en cascade (Admin)
  async deleteProduct(id: number): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundError("Le produit à supprimer n'existe pas.");
    }

    try {
      await this.productRepository.delete(id);
    } catch (error) {
      throw new InternalServerError("Échec de la suppression du produit.");
    }
  }

  // 6. Mettre à jour un produit et synchroniser ses variantes de prix complexes (Admin)
  async updateProduct(
    id: number,
    data: UpdateProductInput,
  ): Promise<FullProductOutput> {
    const existing = await this.productRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Le produit à modifier n'existe pas.");
    }

    // Gestion du slug si le nom du produit est modifié
    let newSlug: string | undefined = undefined;
    if (data.name && data.name !== existing.name) {
      newSlug = this.generateSlug(data.name);
      const duplicate = await this.productRepository.findBySlug(newSlug);
      if (duplicate && duplicate.id !== id) {
        throw new ConflictError("Un autre produit porte déjà ce nom.");
      }
    }

    try {
      // Pour gérer proprement l'écriture simultanée des modifications d'un JSON imbriqué,
      // la méthode la plus sûre de Prisma consiste à exécuter une transaction d'écriture isolée.
      return await prisma.$transaction(async (tx) => {
        // A. Mise à jour de la table parente Product
        await tx.product.update({
          where: { id },
          data: {
            name: data.name,
            slug: newSlug,
          },
        });

        // B. Synchronisation des Variantes & des PricingRules si elles sont soumises
        if (data.variants) {
          for (const variantData of data.variants) {
            if (variantData.id) {
              // Scénario : La variante existe déjà -> On met à jour son nom
              await tx.productVariant.update({
                where: { id: variantData.id },
                data: { name: variantData.name },
              });

              if (variantData.pricingRule.id) {
                // Scénario : La règle de prix existe -> On écrase son JSON config et son mode
                await tx.pricingRule.update({
                  where: { id: variantData.pricingRule.id },
                  data: {
                    pricingMode: variantData.pricingRule.pricingMode,
                    config: variantData.pricingRule
                      .config as Prisma.InputJsonValue,
                  },
                });
              }
            } else {
              // Scénario : L'Id est absent -> L'administrateur a cliqué sur "Ajouter une variante" dans l'UI
              // On crée à la volée la nouvelle variante et sa règle liée
              await tx.productVariant.create({
                data: {
                  productId: id,
                  name: variantData.name,
                  pricingRules: {
                    create: {
                      pricingMode: variantData.pricingRule.pricingMode,
                      config: variantData.pricingRule
                        .config as Prisma.InputJsonValue,
                    },
                  },
                },
              });
            }
          }
        }

        // C. On récupère le produit final agrégé et mis à jour pour le renvoyer à l'UI
        const updatedProduct = await tx.product.findUnique({
          where: { id },
          select: {
            id: true,
            name: true,
            slug: true,
            createdAt: true,
            updatedAt: true,
            variants: {
              include: {
                pricingRules: true,
              },
            },
          },
        });

        return updatedProduct as unknown as FullProductOutput;
      });
    } catch (error) {
      throw new InternalServerError(
        "Une erreur est survenue lors de la mise à jour de la grille tarifaire.",
      );
    }
  }
}

export const productService = new ProductService(new ProductRepository());
