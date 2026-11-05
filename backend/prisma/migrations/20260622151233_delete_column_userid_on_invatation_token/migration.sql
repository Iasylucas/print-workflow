/*
  Warnings:

  - You are about to drop the column `userId` on the `InvitationToken` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "InvitationToken" DROP CONSTRAINT "InvitationToken_userId_fkey";

-- AlterTable
ALTER TABLE "InvitationToken" DROP COLUMN "userId";
