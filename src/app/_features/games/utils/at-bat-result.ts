import { positionLabel, resultLabel } from "@/app/_constants/labels";
import type { GameDetail } from "@/app/_features/games/api/get-games";
import type { AtBatResult, Position } from "@/generated/prisma/client";

/** 打数に含まれない結果 */
export const nonAtBatResults: AtBatResult[] = [
  "walk",
  "hitByPitch",
  "sacrificeHit",
  "sacrificeFly",
];

/** ヒット性の結果 */
export const hitResults: AtBatResult[] = [
  "single",
  "double",
  "triple",
  "homeRun",
];

/** 四死球・犠打 */
export const nonAtBatPositiveResults: AtBatResult[] = [
  "walk",
  "hitByPitch",
  "sacrificeHit",
  "sacrificeFly",
];

/** 打席結果を日本語表記に変換（例: 左安、遊ゴ、三振） */
export function formatAtBatResult(
  result: AtBatResult,
  direction: Position | null,
): string {
  const rLabel = resultLabel[result];
  if (!direction) return rLabel;
  return `${positionLabel[direction]}${rLabel}`;
}

/** 打席結果に応じた背景色クラスを返す */
export function getResultColorClass(result: AtBatResult): string {
  if (hitResults.includes(result)) return "bg-rose-400";
  if (nonAtBatPositiveResults.includes(result)) return "bg-amber-400";
  return "bg-blue-400";
}

/** 長打（二塁打・三塁打・本塁打）を打った選手をそれぞれ抽出する */
export function getExtraBaseHitMembers(gameMembers: GameDetail["gameMembers"]) {
  const doubles: GameDetail["gameMembers"] = [];
  const triples: GameDetail["gameMembers"] = [];
  const homeRuns: GameDetail["gameMembers"] = [];

  for (const gm of gameMembers) {
    const results = gm.plateAppearances.map((pa) => pa.result);
    if (results.includes("double")) doubles.push(gm);
    if (results.includes("triple")) triples.push(gm);
    if (results.includes("homeRun")) homeRuns.push(gm);
  }

  return { doubles, triples, homeRuns };
}
