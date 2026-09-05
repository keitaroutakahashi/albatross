-- AlterTable: subPosition (単一) → subPositions (配列) へ変換
-- 既存データを保持しつつ移行する

-- 1. 新しい配列カラムを追加
ALTER TABLE "Member" ADD COLUMN "subPositions" "Position"[] DEFAULT ARRAY[]::"Position"[];

-- 2. 既存データを移行（subPosition が NULL でない場合は配列に変換）
UPDATE "Member" SET "subPositions" = ARRAY["subPosition"]::"Position"[] WHERE "subPosition" IS NOT NULL;

-- 3. 旧カラムを削除
ALTER TABLE "Member" DROP COLUMN "subPosition";

-- 4. デフォルト値を維持
