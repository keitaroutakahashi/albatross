/*
  Warnings:

  - You are about to drop the column `year` on the `Season` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[season]` on the table `Season` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `season` to the `Season` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Season_year_key";

-- AlterTable
ALTER TABLE "Season" DROP COLUMN "year",
ADD COLUMN     "season" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Season_season_key" ON "Season"("season");
