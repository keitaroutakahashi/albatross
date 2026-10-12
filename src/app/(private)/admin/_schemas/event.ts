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

const score = optionalInt(0, 99);

const gameEventSchema = z
  .object({
    ...eventBase,
    type: z.literal("game"),
    gameNumber: requiredInt(1, 9),
    gameType: enumField(GameType),
    isFirstBatting: optionalBoolean,
    leagueId: optionalId,
    groundId: optionalId,
    opponentId: optionalId,
    teamScore: score,
    opponentScore: score,
    teamHits: score,
    opponentHits: score,
    teamErrors: score,
    opponentErrors: score,
    teamForfeitedRuns: score,
    opponentForfeitedRuns: score,
    weather: optionalEnumField(Weather),
    temperature: optionalNumber(-30, 50),
    summary: optionalText(2000),
    videoUrl: optionalUrl,
    aiGoodPoints: optionalText(2000),
    aiBadPoints: optionalText(2000),
  })
  .refine((v) => v.temperature === null || v.weather !== null, {
    // 気温は天候テーブルに保存するため、天気がないと保存先がない
    path: ["weather"],
    message: "気温を入力する場合は天気も選択してください",
  });

const practiceEventSchema = z.object({
  ...eventBase,
  type: z.literal("practice"),
  groundId: optionalId,
});

export const eventSchema = z.discriminatedUnion(
  "type",
  [gameEventSchema, practiceEventSchema],
  { error: "種別を選択してください" },
);

export type EventInput = z.output<typeof eventSchema>;
export type GameEventInput = Extract<EventInput, { type: "game" }>;

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
