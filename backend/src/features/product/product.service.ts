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
} from "@/shared/error/error.js";
import { prisma } from "@/config/prisma.js";
import { Prisma } from "@/generated/prisma/client.js";
import { PRODUCT_ERRORS } from "./product.constants.js";

export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-");
  }

  async createProduct(data: CreateProductInput): Promise<FullProductOutput> {
    const slug = this.generateSlug(data.name);

    const existingProduct = await this.productRepository.findBySlug(slug);
    if (existingProduct) {
      throw new ConflictError(PRODUCT_ERRORS.DUPLICATE_NAME);
    }

    try {
      const product = await this.productRepository.create(data, slug);
      return product as unknown as FullProductOutput;
    } catch (error) {
      throw new InternalServerError(PRODUCT_ERRORS.CREATE_FAILED);
    }
  }

  async getProductById(id: number): Promise<FullProductOutput> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundError(PRODUCT_ERRORS.NOT_FOUND);
    }
    return product as unknown as FullProductOutput;
  }

  async listProducts(query: ProductQuery) {
    return await this.productRepository.findAll(query);
  }

  async deleteProduct(id: number): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundError(PRODUCT_ERRORS.DELETE_NOT_FOUND);
    }

    try {
      await this.productRepository.delete(id);
    } catch (error) {
      throw new InternalServerError(PRODUCT_ERRORS.DELETE_FAILED);
    }
  }

  async updateProduct(
    id: number,
    data: UpdateProductInput,
  ): Promise<FullProductOutput> {
    const existing = await this.productRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(PRODUCT_ERRORS.NOT_FOUND);
    }

    let newSlug: string | undefined = undefined;
    if (data.name && data.name !== existing.name) {
      newSlug = this.generateSlug(data.name);
      const duplicate = await this.productRepository.findBySlug(newSlug);
      if (duplicate && duplicate.id !== id) {
        throw new ConflictError(PRODUCT_ERRORS.DUPLICATE_NAME);
      }
    }

    try {
      return await prisma.$transaction(async (tx) => {
        await tx.product.update({
          where: { id },
          data: {
            name: data.name,
            slug: newSlug,
          },
        });

        if (data.variants) {
          for (const variantData of data.variants) {
            if (variantData.id) {
              await tx.productVariant.update({
                where: { id: variantData.id },
                data: { name: variantData.name },
              });

              if (variantData.pricingRule.id) {
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
