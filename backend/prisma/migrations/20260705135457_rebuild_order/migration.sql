/*
  Warnings:

  - You are about to drop the column `name` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `heightCm` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `options` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `pricingRuleId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `reference` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `variantId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `widthCm` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `WorkshopConfig` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_pricingRuleId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_variantId_fkey";

-- DropIndex
DROP INDEX "Order_reference_key";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "name",
DROP COLUMN "type",
ADD COLUMN     "category" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "heightCm",
DROP COLUMN "options",
DROP COLUMN "pricingRuleId",
DROP COLUMN "reference",
DROP COLUMN "totalPrice",
DROP COLUMN "variantId",
DROP COLUMN "widthCm",
ADD COLUMN     "dimensions" TEXT,
ADD COLUMN     "label" TEXT,
ADD COLUMN     "productId" INTEGER;

-- DropTable
DROP TABLE "WorkshopConfig";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
