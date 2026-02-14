-- CreateEnum
CREATE TYPE "MemberType" AS ENUM ('starting', 'bench');

-- CreateEnum
CREATE TYPE "AtBatResult" AS ENUM ('single', 'double', 'triple', 'homeRun', 'walk', 'hitByPitch', 'strikeout', 'groundOut', 'flyOut', 'lineOut', 'sacrificeHit', 'sacrificeFly', 'fieldersChoice', 'doublePlay', 'error');

-- AlterEnum
ALTER TYPE "Position" ADD VALUE 'dh';

-- CreateTable
CREATE TABLE "GameMember" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "memberType" "MemberType" NOT NULL,
    "battingOrder" INTEGER,
    "position" "Position",
    "stolenBases" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlateAppearance" (
    "id" SERIAL NOT NULL,
    "gameMemberId" INTEGER NOT NULL,
    "inningNumber" INTEGER NOT NULL,
    "atBatInGame" INTEGER NOT NULL,
    "result" "AtBatResult" NOT NULL,
    "direction" "Position",
    "rbi" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlateAppearance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameMember_gameId_memberId_key" ON "GameMember"("gameId", "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "PlateAppearance_gameMemberId_atBatInGame_key" ON "PlateAppearance"("gameMemberId", "atBatInGame");

-- AddForeignKey
ALTER TABLE "GameMember" ADD CONSTRAINT "GameMember_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameMember" ADD CONSTRAINT "GameMember_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlateAppearance" ADD CONSTRAINT "PlateAppearance_gameMemberId_fkey" FOREIGN KEY ("gameMemberId") REFERENCES "GameMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
