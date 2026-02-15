-- CreateEnum
CREATE TYPE "PitchingDecision" AS ENUM ('win', 'loss');

-- CreateTable
CREATE TABLE "PitchingResult" (
    "id" SERIAL NOT NULL,
    "gameMemberId" INTEGER NOT NULL,
    "inningsPitched" INTEGER NOT NULL DEFAULT 0,
    "partialOuts" INTEGER,
    "earnedRuns" INTEGER NOT NULL DEFAULT 0,
    "runs" INTEGER NOT NULL DEFAULT 0,
    "strikeouts" INTEGER NOT NULL DEFAULT 0,
    "walks" INTEGER NOT NULL DEFAULT 0,
    "hitByPitches" INTEGER NOT NULL DEFAULT 0,
    "hitsAllowed" INTEGER NOT NULL DEFAULT 0,
    "homeRunsAllowed" INTEGER NOT NULL DEFAULT 0,
    "decision" "PitchingDecision",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PitchingResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PitchingResult_gameMemberId_key" ON "PitchingResult"("gameMemberId");

-- AddForeignKey
ALTER TABLE "PitchingResult" ADD CONSTRAINT "PitchingResult_gameMemberId_fkey" FOREIGN KEY ("gameMemberId") REFERENCES "GameMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
