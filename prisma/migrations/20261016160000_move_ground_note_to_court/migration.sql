-- AlterTable
ALTER TABLE "Ground" DROP COLUMN "note";

-- AlterTable
ALTER TABLE "Game" ADD COLUMN "groundCourt" TEXT;

-- AlterTable
ALTER TABLE "Practice" ADD COLUMN "groundCourt" TEXT;
