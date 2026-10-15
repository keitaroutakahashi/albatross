import { z } from "zod";
import { toYouTubeEmbedUrl } from "@/app/_utils/youtube";
import {
  enumField,
  jstDateTime,
  optionalBoolean,
  optionalEnumField,
  optionalId,
  optionalNumber,
  optionalText,
  requiredId,
} from "@/app/(private)/admin/_schemas/fields";
import { GameType, Weather } from "@/generated/prisma/enums";

/** いつ・どこで。試合・練習で共通 */
export const eventScheduleSchema = z.object({
  date: jstDateTime,
  seasonId: requiredId,
  groundId: optionalId,
  note: optionalText(200),
  cancelReason: optionalText(200),
});

/** 対戦（試合のみ） */
export const eventMatchupSchema = z.object({
  opponentId: optionalId,
  leagueId: optionalId,
  gameType: enumField(GameType),
  isFirstBatting: optionalBoolean,
});

/**
 * 試合動画の URL。YouTube の動画 URL（共有用の短縮 URL や視聴ページの URL でもよい）を、
 * 枠の中に表示できる埋め込み用の URL に直して保存する。未入力は null として扱う。
 */
const videoUrl = optionalText(500).transform((value, ctx) => {
  if (value === null) return null;
  const embedUrl = toYouTubeEmbedUrl(value);
  if (embedUrl === null) {
    ctx.addIssue({
      code: "custom",
      message: "YouTube の動画 URL を入力してください",
    });
    return z.NEVER;
  }
  return embedUrl;
});

/** 試合の振り返り（試合のみ）。天候・戦評・動画・AI 講評。MVP は枠ごとの入力のため、別に検証する（parseMvps） */
export const eventReviewSchema = z
  .object({
    weather: optionalEnumField(Weather),
    temperature: optionalNumber(-30, 50),
    summary: optionalText(2000),
    videoUrl,
    aiGoodPoints: optionalText(2000),
    aiBadPoints: optionalText(2000),
  })
  .refine((v) => v.temperature === null || v.weather !== null, {
    // 気温は天候テーブルに保存するため、天気がないと保存先がない
    path: ["weather"],
    message: "気温を入力する場合は天気も選択してください",
  });

/**
 * 新規登録で入力する項目。状態は常に「開催予定」で登録するため入力させず、
 * 結果・備考などの詳細は登録後に編集画面で入力する。
 */
export const eventCreateSchema = z.discriminatedUnion(
  "type",
  [
    z.object({
      type: z.literal("game"),
      date: jstDateTime,
      seasonId: requiredId,
      gameType: enumField(GameType),
    }),
    z.object({
      type: z.literal("practice"),
      date: jstDateTime,
      seasonId: requiredId,
    }),
  ],
  { error: "種別を選択してください" },
);
