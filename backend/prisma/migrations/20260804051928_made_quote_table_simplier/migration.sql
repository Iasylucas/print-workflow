/*
  Warnings:

  - Made the column `firstName` on table `Client` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_originalQuoteId_fkey";

-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "firstName" DROP NOT NULL;
