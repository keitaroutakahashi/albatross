/*
  Warnings:

  - The values [SCHEDULED,COMPLETED,CANCELED] on the enum `GameStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [OFFICIAL,PRACTICE] on the enum `GameType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GameStatus_new" AS ENUM ('scheduled', 'completed', 'canceled');
ALTER TABLE "public"."Game" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Game" ALTER COLUMN "status" TYPE "GameStatus_new" USING ("status"::text::"GameStatus_new");
ALTER TYPE "GameStatus" RENAME TO "GameStatus_old";
ALTER TYPE "GameStatus_new" RENAME TO "GameStatus";
DROP TYPE "public"."GameStatus_old";
ALTER TABLE "Game" ALTER COLUMN "status" SET DEFAULT 'scheduled';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "GameType_new" AS ENUM ('official', 'practice');
ALTER TABLE "public"."Game" ALTER COLUMN "gameType" DROP DEFAULT;
ALTER TABLE "Game" ALTER COLUMN "gameType" TYPE "GameType_new" USING ("gameType"::text::"GameType_new");
ALTER TYPE "GameType" RENAME TO "GameType_old";
ALTER TYPE "GameType_new" RENAME TO "GameType";
DROP TYPE "public"."GameType_old";
ALTER TABLE "Game" ALTER COLUMN "gameType" SET DEFAULT 'official';
COMMIT;

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "gameType" SET DEFAULT 'official',
ALTER COLUMN "status" SET DEFAULT 'scheduled';
