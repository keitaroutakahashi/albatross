-- CreateTable
CREATE TABLE "GameMvp" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameMvp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameMvp_gameId_memberId_key" ON "GameMvp"("gameId", "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "GameMvp_gameId_order_key" ON "GameMvp"("gameId", "order");

-- AddForeignKey
ALTER TABLE "GameMvp" ADD CONSTRAINT "GameMvp_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameMvp" ADD CONSTRAINT "GameMvp_gameId_memberId_fkey" FOREIGN KEY ("gameId", "memberId") REFERENCES "GameParticipant"("gameId", "memberId") ON DELETE NO ACTION ON UPDATE CASCADE;

-- 参加メンバーの MVP を移す。表示順は、参加メンバーの登録順（id 順）で 1 から振る
INSERT INTO "GameMvp" ("gameId", "memberId", "order", "comment", "updatedAt")
SELECT
    "gameId",
    "memberId",
    ROW_NUMBER() OVER (PARTITION BY "gameId" ORDER BY "id"),
    "mvpComment",
    CURRENT_TIMESTAMP
FROM "GameParticipant"
WHERE "isMvp";

-- AlterTable
ALTER TABLE "GameParticipant" DROP COLUMN "isMvp",
DROP COLUMN "mvpComment";
