/*
  Warnings:

  - You are about to drop the column `jerseyNumber` on the `Member` table. All the data in the column will be lost.
  - Added the required column `uniformNumber` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Made the column `position` on table `Member` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Member" DROP COLUMN "jerseyNumber",
ADD COLUMN     "uniformNumber" TEXT NOT NULL,
ALTER COLUMN "position" SET NOT NULL,
ALTER COLUMN "subPositions" DROP DEFAULT;
