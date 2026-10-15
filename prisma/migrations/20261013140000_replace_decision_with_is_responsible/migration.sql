-- AlterTable
ALTER TABLE "PitchingResult" ADD COLUMN "isResponsible" BOOLEAN NOT NULL DEFAULT false;

-- 勝敗が記録されていた投手を責任投手にする
UPDATE "PitchingResult" SET "isResponsible" = true WHERE "decision" IS NOT NULL;

-- AlterTable
ALTER TABLE "PitchingResult" DROP COLUMN "decision";

-- DropEnum
DROP TYPE "PitchingDecision";
