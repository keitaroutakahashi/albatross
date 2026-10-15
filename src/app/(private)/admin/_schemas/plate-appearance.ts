import { z } from "zod";
import {
  enumField,
  optionalEnumField,
  requiredInt,
} from "@/app/(private)/admin/_schemas/fields";
import { AtBatResult, Position } from "@/generated/prisma/enums";

export const MAX_AT_BATS = 20;

/** 打球方向がない打席結果。入力欄を出さず、保存もしない（これ以外の結果は打球方向が必須） */
export const NO_DIRECTION_RESULTS: readonly AtBatResult[] = [
  "strikeout",
  "walk",
  "hitByPitch",
];

/** 打点がつかない打席結果。入力欄を出さず、打点 0 として保存する */
export const NO_RBI_RESULTS: readonly AtBatResult[] = [
  "error",
  "doublePlay",
  "strikeout",
];

/** 入力欄は打席の並び（打席番号 = 行の位置 + 1）で対応づける。名前は配列として複数送られる */
export const AT_BAT_FIELDS = {
  inningNumber: "inningNumber",
  result: "result",
  direction: "direction",
  rbi: "rbi",
  /** チェックした行の打席番号（1 始まり）が値として送られる */
  isScoringPosition: "isScoringPosition",
} as const;

/** 行ごとのエラーを紐づけるフィールド名（0 始まりの行番号） */
export const atBatFieldName = (
  field: keyof typeof AT_BAT_FIELDS,
  index: number,
) => `${field}-${index}`;

/** 打席全体に関するエラーを紐づけるキー */
export const AT_BATS_ERROR_KEY = "atBats";

export type AtBatEntry = {
  /** その選手の何打席目か（行の位置 + 1） */
  atBatInGame: number;
  inningNumber: number;
  result: AtBatResult;
  direction: Position | null;
  rbi: number;
  isScoringPosition: boolean;
};

type Result =
  | { success: true; entries: AtBatEntry[] }
  | { success: false; fieldErrors: Record<string, string> };

const strings = (formData: FormData, name: string): string[] =>
  formData.getAll(name).filter((v): v is string => typeof v === "string");

const rowSchema = z.object({
  inningNumber: requiredInt(1, 30),
  result: enumField(AtBatResult),
  direction: optionalEnumField(Position),
  rbi: requiredInt(0, 4),
});

/**
 * 1 人分の打席フォームの入力を検証する。
 * 何も入力されていない行は「その打席は未登録」として結果に含めない。
 */
export const parseAtBats = (formData: FormData): Result => {
  const results = strings(formData, AT_BAT_FIELDS.result);
  if (results.length > MAX_AT_BATS) {
    return {
      success: false,
      fieldErrors: { [AT_BATS_ERROR_KEY]: "打席が多すぎます" },
    };
  }

  const innings = strings(formData, AT_BAT_FIELDS.inningNumber);
  const directions = strings(formData, AT_BAT_FIELDS.direction);
  const rbis = strings(formData, AT_BAT_FIELDS.rbi);
  const scoring = new Set(strings(formData, AT_BAT_FIELDS.isScoringPosition));

  const fieldErrors: Record<string, string> = {};
  const entries: AtBatEntry[] = [];

  results.forEach((result, i) => {
    const submittedRbi = (rbis[i] ?? "").trim() === "" ? "0" : (rbis[i] ?? "0");
    const raw = {
      inningNumber: innings[i] ?? "",
      result,
      direction: directions[i] ?? "",
      // エラー出塁・併殺打・三振には打点がつかないため、送信されていても 0 とみなす
      rbi: (NO_RBI_RESULTS as readonly string[]).includes(result)
        ? "0"
        : submittedRbi,
    };
    const isScoringPosition = scoring.has(String(i + 1));

    // 何も入力されていない行は、未登録の打席として読み飛ばす
    const isBlank =
      raw.result === "" &&
      raw.inningNumber.trim() === "" &&
      raw.direction === "" &&
      raw.rbi === "0" &&
      !isScoringPosition;
    if (isBlank) return;

    const parsed = rowSchema.safeParse(raw);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = String(issue.path[0]) as keyof typeof AT_BAT_FIELDS;
        fieldErrors[atBatFieldName(field, i)] ??= issue.message;
      }
      return;
    }

    // 三振・四死球には打球方向がないため、送信されていても保存しない。それ以外は必須
    const hasDirection = !NO_DIRECTION_RESULTS.includes(parsed.data.result);
    if (hasDirection && parsed.data.direction === null) {
      fieldErrors[atBatFieldName("direction", i)] =
        "打球方向を選択してください";
      return;
    }

    entries.push({
      atBatInGame: i + 1,
      ...parsed.data,
      direction: hasDirection ? parsed.data.direction : null,
      isScoringPosition,
    });
  });

  return Object.keys(fieldErrors).length > 0
    ? { success: false, fieldErrors }
    : { success: true, entries };
};
