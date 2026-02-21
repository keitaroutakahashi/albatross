/*
  Warnings:

  - You are about to drop the column `note` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "note",
ADD COLUMN     "summary" TEXT;
