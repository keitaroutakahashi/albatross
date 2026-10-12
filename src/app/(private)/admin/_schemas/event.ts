import { z } from "zod";
import {
  enumField,
  jstDateTime,
  optionalBoolean,
  optionalEnumField,
  optionalId,
  optionalInt,
  optionalNumber,
  optionalText,
  optionalUrl,
  requiredId,
  requiredInt,
} from "@/app/(private)/admin/_schemas/fields";
import { EventStatus, GameType, Weather } from "@/generated/prisma/enums";

const eventBase = {
  date: jstDateTime,
  status: enumField(EventStatus),
  seasonId: requiredId,
  note: optionalText(200),
};

/** 試合の基本情報に含める、天候・戦評・動画・AI 講評 */
const gameExtras = {
  weather: optionalEnumField(Weather),
  temperature: optionalNumber(-30, 50),
  summary: optionalText(2000),
  videoUrl: optionalUrl,
  aiGoodPoints: optionalText(2000),
  aiBadPoints: optionalText(2000),
};

/** 基本情報（日時・状態などの共通項目と、試合・練習それぞれの項目） */
export const eventBasicSchema = z.discriminatedUnion(
  "type",
  [
    z
      .object({
        ...eventBase,
        type: z.literal("game"),
        gameNumber: requiredInt(1, 9),
        gameType: enumField(GameType),
        isFirstBatting: optionalBoolean,
        leagueId: optionalId,
        groundId: optionalId,
        opponentId: optionalId,
        ...gameExtras,
      })
      .refine((v) => v.temperature === null || v.weather !== null, {
        // 気温は天候テーブルに保存するため、天気がないと保存先がない
        path: ["weather"],
        message: "気温を入力する場合は天気も選択してください",
      }),
    z.object({
      ...eventBase,
      type: z.literal("practice"),
      groundId: optionalId,
    }),
  ],
  { error: "種別を選択してください" },
);

const score = optionalInt(0, 99);

/**
 * 試合結果の手入力項目（安打・失策）。
 * 得点・献上点・勝敗は「イニングごとの得点」の保存で設定するため、ここでは受け取らない。
 */
export const eventResultSchema = z.object({
  teamHits: score,
  opponentHits: score,
  teamErrors: score,
  opponentErrors: score,
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
      gameNumber: requiredInt(1, 9),
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
