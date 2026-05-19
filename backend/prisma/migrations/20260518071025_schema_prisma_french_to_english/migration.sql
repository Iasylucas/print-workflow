/*
  Warnings:

  - You are about to drop the column `inscriptionsOuvertes` on the `AppSettings` table. All the data in the column will be lost.
  - You are about to drop the column `maxInscriptions` on the `AppSettings` table. All the data in the column will be lost.
  - You are about to drop the column `adresse` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `nom` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `telephone` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `commandeId` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `texte` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `isActif` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Commande` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ConfigurationAtelier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Devis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EntrepriseInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Facture` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Fichier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Paiement` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lastName` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Commande" DROP CONSTRAINT "Commande_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Commande" DROP CONSTRAINT "Commande_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Commande" DROP CONSTRAINT "Commande_devisId_fkey";

-- DropForeignKey
ALTER TABLE "Commande" DROP CONSTRAINT "Commande_factureId_fkey";

-- DropForeignKey
ALTER TABLE "Commande" DROP CONSTRAINT "Commande_pricingRuleId_fkey";

-- DropForeignKey
ALTER TABLE "Commande" DROP CONSTRAINT "Commande_variantId_fkey";

-- DropForeignKey
ALTER TABLE "Devis" DROP CONSTRAINT "Devis_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Devis" DROP CONSTRAINT "Devis_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Devis" DROP CONSTRAINT "Devis_entrepriseInfoId_fkey";

-- DropForeignKey
ALTER TABLE "Facture" DROP CONSTRAINT "Facture_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Facture" DROP CONSTRAINT "Facture_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Facture" DROP CONSTRAINT "Facture_devisOrigineId_fkey";

-- DropForeignKey
ALTER TABLE "Facture" DROP CONSTRAINT "Facture_entrepriseInfoId_fkey";

-- DropForeignKey
ALTER TABLE "Fichier" DROP CONSTRAINT "Fichier_commandeId_fkey";

-- DropForeignKey
ALTER TABLE "Fichier" DROP CONSTRAINT "Fichier_uploadedById_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_commandeId_fkey";

-- DropForeignKey
ALTER TABLE "Paiement" DROP CONSTRAINT "Paiement_encaisseParId_fkey";

-- DropForeignKey
ALTER TABLE "Paiement" DROP CONSTRAINT "Paiement_factureId_fkey";

-- AlterTable
ALTER TABLE "AppSettings" DROP COLUMN "inscriptionsOuvertes",
DROP COLUMN "maxInscriptions",
ADD COLUMN     "maxRegistrations" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "registrationsOpen" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "adresse",
DROP COLUMN "nom",
DROP COLUMN "telephone",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "commandeId",
DROP COLUMN "texte",
ADD COLUMN     "orderId" INTEGER NOT NULL,
ADD COLUMN     "text" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isActif",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Commande";

-- DropTable
DROP TABLE "ConfigurationAtelier";

-- DropTable
DROP TABLE "Devis";

-- DropTable
DROP TABLE "EntrepriseInfo";

-- DropTable
DROP TABLE "Facture";

-- DropTable
DROP TABLE "Fichier";

-- DropTable
DROP TABLE "Paiement";

-- CreateTable
CREATE TABLE "CompanyInfo" (
    "id" SERIAL NOT NULL,
    "version" INTEGER NOT NULL,
    "nif" TEXT NOT NULL,
    "stat" TEXT NOT NULL,
    "rif" TEXT NOT NULL,
    "mainAddress" TEXT NOT NULL,
    "mainAddressDetail" TEXT,
    "secondaryAddress" TEXT NOT NULL,
    "secondaryAddressDetail" TEXT,
    "logo" TEXT,
    "stamp" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "mobileMoneyNumbers" JSONB,
    "standardPhone" TEXT,
    "contactEmail" TEXT,
    "termsAndConditions" TEXT,
    "deliveryLeadTime" TEXT,
    "bankAccountHolder" TEXT,
    "bankBranch" TEXT,
    "bankCode" TEXT,
    "ribInfo" TEXT,

    CONSTRAINT "CompanyInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "companyInfoId" INTEGER NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "deposit" INTEGER NOT NULL DEFAULT 0,
    "remaining" INTEGER NOT NULL,
    "deliveryPlace" TEXT,
    "expectedDeliveryDate" TIMESTAMP(3),
    "isDelivered" BOOLEAN NOT NULL DEFAULT false,
    "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid',
    "companyInfoId" INTEGER NOT NULL,
    "originalQuoteId" INTEGER,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "reference" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receivedById" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "reference" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "quoteId" INTEGER,
    "invoiceId" INTEGER,
    "variantId" TEXT NOT NULL,
    "options" JSONB,
    "pricingRuleId" TEXT NOT NULL,
    "widthCm" DOUBLE PRECISION,
    "heightCm" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'waiting_for_file',
    "quantity" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkshopConfig" (
    "id" TEXT NOT NULL,
    "maxWidthM" DOUBLE PRECISION NOT NULL DEFAULT 1.5,
    "cuttingMarginM" DOUBLE PRECISION NOT NULL DEFAULT 0.02,
    "referenceSurfaceM2" JSONB NOT NULL DEFAULT '{"width":1.5,"height":0.7}',
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "WorkshopConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quote_number_key" ON "Quote"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_number_key" ON "Invoice"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_originalQuoteId_key" ON "Invoice"("originalQuoteId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_reference_key" ON "Order"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_companyInfoId_fkey" FOREIGN KEY ("companyInfoId") REFERENCES "CompanyInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_companyInfoId_fkey" FOREIGN KEY ("companyInfoId") REFERENCES "CompanyInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_originalQuoteId_fkey" FOREIGN KEY ("originalQuoteId") REFERENCES "Quote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_receivedById_fkey" FOREIGN KEY ("receivedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_pricingRuleId_fkey" FOREIGN KEY ("pricingRuleId") REFERENCES "PricingRule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
