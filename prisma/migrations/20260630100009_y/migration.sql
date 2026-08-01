-- AlterEnum
ALTER TYPE "GameType" ADD VALUE 'undecided';

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_opponentId_fkey";

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "aiBadPoints" TEXT,
ADD COLUMN     "aiGoodPoints" TEXT,
ADD COLUMN     "videoUrl" TEXT,
ALTER COLUMN "gameType" SET DEFAULT 'undecided',
ALTER COLUMN "isFirstBatting" DROP NOT NULL,
ALTER COLUMN "isFirstBatting" DROP DEFAULT,
ALTER COLUMN "leagueId" DROP NOT NULL,
ALTER COLUMN "opponentId" DROP NOT NULL,
ALTER COLUMN "teamScore" DROP NOT NULL,
ALTER COLUMN "teamScore" DROP DEFAULT,
ALTER COLUMN "opponentScore" DROP NOT NULL,
ALTER COLUMN "opponentScore" DROP DEFAULT,
ALTER COLUMN "opponentErrors" DROP NOT NULL,
ALTER COLUMN "opponentErrors" DROP DEFAULT,
ALTER COLUMN "opponentHits" DROP NOT NULL,
ALTER COLUMN "opponentHits" DROP DEFAULT,
ALTER COLUMN "teamErrors" DROP NOT NULL,
ALTER COLUMN "teamErrors" DROP DEFAULT,
ALTER COLUMN "teamHits" DROP NOT NULL,
ALTER COLUMN "teamHits" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_opponentId_fkey" FOREIGN KEY ("opponentId") REFERENCES "Opponent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
