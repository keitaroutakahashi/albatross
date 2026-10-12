-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'operator');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'operator';

-- 管理者がいなくなると誰も管理できなくなるため、最初に登録されたユーザーを管理者にする
UPDATE "User" SET "role" = 'admin' WHERE "id" = (SELECT MIN("id") FROM "User");
