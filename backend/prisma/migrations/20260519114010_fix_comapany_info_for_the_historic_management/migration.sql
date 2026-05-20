/*
  Warnings:

  - You are about to drop the column `endDate` on the `CompanyInfo` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `CompanyInfo` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `CompanyInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CompanyInfo" DROP COLUMN "endDate",
DROP COLUMN "isActive",
DROP COLUMN "startDate",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
