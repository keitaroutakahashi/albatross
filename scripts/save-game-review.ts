/**
 * AI 講評（良かった点・改善点）を試合に保存する。
 * すでに講評が入っている試合には書き込まない。--apply を付けるまでは内容の確認だけ行う。
 *
 *   pnpm review:save <eventId> <review.json>            # 確認のみ
 *   pnpm review:save:production <eventId> <review.json> --apply
 *
 * review.json は { "goodPoints": "...", "badPoints": "..." }
 */
import { readFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { config } from "dotenv";

// lib/prisma.ts は読み込み時に DATABASE_URL を参照するため、先に環境変数を読み込む
config({ path: ".env.local" });

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { apply: { type: "boolean", default: false } },
});
const eventId = Number(positionals[0]);
const jsonPath = positionals[1];
if (!Number.isInteger(eventId) || !jsonPath) {
  console.error("使い方: pnpm review:save <eventId> <review.json> [--apply]");
  process.exit(1);
}

// 講評の長さの上限。管理画面の入力の上限（2000 字）より短く、skill の方針に合わせる
const MAX_LENGTH = 300;

const review: { goodPoints?: unknown; badPoints?: unknown } = JSON.parse(
  readFileSync(jsonPath, "utf-8"),
);
const goodPoints =
  typeof review.goodPoints === "string" ? review.goodPoints.trim() : "";
const badPoints =
  typeof review.badPoints === "string" ? review.badPoints.trim() : "";

const errors: string[] = [];
if (goodPoints === "") errors.push("良かった点が空です");
if (badPoints === "") errors.push("改善点が空です");
if (goodPoints.length > MAX_LENGTH) {
  errors.push(`良かった点が ${MAX_LENGTH} 字を超えています`);
}
if (badPoints.length > MAX_LENGTH) {
  errors.push(`改善点が ${MAX_LENGTH} 字を超えています`);
}

const { default: prisma } = await import("@/lib/prisma");
const game = await prisma.game.findUnique({
  where: { eventId },
  select: {
    id: true,
    aiGoodPoints: true,
    aiBadPoints: true,
    event: { select: { date: true, status: true } },
    opponent: { select: { name: true } },
  },
});
if (!game) {
  errors.push(`イベント ${eventId} の試合が見つかりません`);
} else if (game.aiGoodPoints?.trim() || game.aiBadPoints?.trim()) {
  errors.push("すでに AI 講評が入力されています（上書きしません）");
}

console.log(
  "== 保存先 ==",
  game
    ? {
        eventId,
        date: game.event.date.toISOString(),
        opponent: game.opponent?.name ?? null,
        status: game.event.status,
      }
    : eventId,
);
console.log(`== 良かった点 (${goodPoints.length} 字) ==\n${goodPoints}`);
console.log(`== 改善点 (${badPoints.length} 字) ==\n${badPoints}`);
console.log(`\n== エラー (${errors.length}) ==`);
for (const e of errors) console.log(`- ${e}`);

if (errors.length > 0 || !game) {
  await prisma.$disconnect();
  process.exit(1);
}
if (!values.apply) {
  console.log("\n--apply を付けていないため、書き込みは行っていません");
  await prisma.$disconnect();
  process.exit(0);
}
await prisma.game.update({
  where: { id: game.id },
  data: { aiGoodPoints: goodPoints, aiBadPoints: badPoints },
});
console.log("\n保存しました");
await prisma.$disconnect();
