/*
  Warnings:

  - The primary key for the `PricingRule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `label` on the `PricingRule` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `PricingRule` table. All the data in the column will be lost.
  - The `id` column on the `PricingRule` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `category` on the `Product` table. All the data in the column will be lost.
  - The `id` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ProductVariant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `active` on the `ProductVariant` table. All the data in the column will be lost.
  - The `id` column on the `ProductVariant` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Format` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `variantId` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `pricingRuleId` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `variantId` on the `PricingRule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `productId` on the `ProductVariant` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_pricingRuleId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_variantId_fkey";

-- DropForeignKey
ALTER TABLE "PricingRule" DROP CONSTRAINT "PricingRule_variantId_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_productId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "variantId",
ADD COLUMN     "variantId" INTEGER NOT NULL,
DROP COLUMN "pricingRuleId",
ADD COLUMN     "pricingRuleId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PricingRule" DROP CONSTRAINT "PricingRule_pkey",
DROP COLUMN "label",
DROP COLUMN "priority",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "variantId",
ADD COLUMN     "variantId" INTEGER NOT NULL,
ADD CONSTRAINT "PricingRule_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
DROP COLUMN "category",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_pkey",
DROP COLUMN "active",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "productId",
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Format";

-- CreateIndex
CREATE INDEX "PricingRule_variantId_idx" ON "PricingRule"("variantId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_pricingRuleId_fkey" FOREIGN KEY ("pricingRuleId") REFERENCES "PricingRule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PricingRule" ADD CONSTRAINT "PricingRule_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
