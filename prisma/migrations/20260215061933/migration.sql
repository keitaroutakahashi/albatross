/*
  Warnings:

  - You are about to drop the column `number` on the `Member` table. All the data in the column will be lost.
  - Added the required column `url` to the `Ground` table without a default value. This is not possible if the table is not empty.
  - Made the column `address` on table `Ground` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "MemberCategory" AS ENUM ('regular', 'guest');

-- CreateEnum
CREATE TYPE "Weather" AS ENUM ('sunny', 'cloudy', 'rainy', 'snowy');

-- AlterTable
ALTER TABLE "Ground" ADD COLUMN     "url" TEXT NOT NULL,
ALTER COLUMN "address" SET NOT NULL;

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "number",
ADD COLUMN     "category" "MemberCategory" NOT NULL DEFAULT 'regular',
ADD COLUMN     "jerseyNumber" TEXT;

-- CreateTable
CREATE TABLE "GameWeather" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "weather" "Weather" NOT NULL,
    "temperature" DOUBLE PRECISION,

    CONSTRAINT "GameWeather_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameWeather_gameId_key" ON "GameWeather"("gameId");

-- AddForeignKey
ALTER TABLE "GameWeather" ADD CONSTRAINT "GameWeather_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
