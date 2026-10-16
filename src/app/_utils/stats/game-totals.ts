import { hitResults } from "@/app/_features/games/utils/at-bat-result";
import type { AtBatResult } from "@/generated/prisma/enums";

/** 自チームの安打数。打席結果のうち、ヒット（単打〜本塁打）の数 */
export const countHits = (results: AtBatResult[]): number =>
  results.filter((r) => hitResults.includes(r)).length;

/** 相手の失策数。自チームの打者が相手のエラーで出塁した打席の数 */
export const countOpponentErrors = (results: AtBatResult[]): number =>
  results.filter((r) => r === "error").length;

/** 相手の安打数。自チームの投手の被安打の合計 */
export const sumHitsAllowed = (hitsAllowed: number[]): number =>
  hitsAllowed.reduce((total, v) => total + v, 0);
