-- CreateTable
CREATE TABLE "GameParticipant" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameParticipant_gameId_memberId_key" ON "GameParticipant"("gameId", "memberId");

-- AddForeignKey
ALTER TABLE "GameParticipant" ADD CONSTRAINT "GameParticipant_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameParticipant" ADD CONSTRAINT "GameParticipant_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- 既存の試合は、出場した選手をそのまま参加メンバーとして引き継ぐ
INSERT INTO "GameParticipant" ("gameId", "memberId", "updatedAt")
SELECT DISTINCT "gameId", "memberId", CURRENT_TIMESTAMP FROM "GameMember";
