import { z } from "zod";
import { parseJstDateTimeLocal } from "@/app/_utils/date/date";

/** 必須の文字列 */
export const requiredText = (max = 100) =>
  z
    .string("必須です")
    .trim()
    .min(1, "必須です")
    .max(max, `${max}文字以内で入力してください`);

/** 任意の文字列。未入力は null として扱う */
export const optionalText = (max = 100) =>
  z
    .string()
    .trim()
    .max(max, `${max}文字以内で入力してください`)
    .transform((v) => (v === "" ? null : v))
    .optional()
    .transform((v) => v ?? null);

/** 整数。FormData は文字列なので、未入力が 0 に変換されないよう先に空判定する */
export const requiredInt = (min: number, max: number) =>
  z
    .string("必須です")
    .trim()
    .min(1, "必須です")
    .transform((v) => Number(v))
    .pipe(
      z
        .number("数値で入力してください")
        .int("整数で入力してください")
        .min(min, `${min}以上で入力してください`)
        .max(max, `${max}以下で入力してください`),
    );

/** チェックボックス。未チェックだとキー自体が送信されない */
export const checkbox = z
  .string()
  .optional()
  .transform((v) => v === "on");

/** 単一選択（native select / radio） */
export const enumField = <const T extends Readonly<Record<string, string>>>(
  values: T,
) => z.enum(values, "選択してください");

/** 同名の入力欄が 1 件だけだと配列ではなく文字列で届くため、配列に揃えてから検証する */
export const arrayOf = <T extends z.ZodType>(item: T) =>
  z.preprocess(
    (v) => (v === undefined || v === "" ? [] : Array.isArray(v) ? v : [v]),
    z.array(item),
  );

/** 複数選択（checkbox group） */
export const enumArrayField = <
  const T extends Readonly<Record<string, string>>,
>(
  values: T,
) => arrayOf(z.enum(values, "選択してください"));

/** 任意の整数。未入力は null として扱う */
export const optionalInt = (min: number, max: number) =>
  z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? Number(v) : null))
    .pipe(
      z
        .number("数値で入力してください")
        .int("整数で入力してください")
        .min(min, `${min}以上で入力してください`)
        .max(max, `${max}以下で入力してください`)
        .nullable(),
    );

/** 任意の小数。未入力は null として扱う */
export const optionalNumber = (min: number, max: number) =>
  z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? Number(v) : null))
    .pipe(
      z
        .number("数値で入力してください")
        .min(min, `${min}以上で入力してください`)
        .max(max, `${max}以下で入力してください`)
        .nullable(),
    );

/** DB の ID（Int）の上限 */
const MAX_ID = 2_147_483_647;

/** select で選んだ関連データの ID */
export const requiredId = requiredInt(1, MAX_ID);

/** 未選択を許容する関連データの ID */
export const optionalId = optionalInt(1, MAX_ID);

/** 未選択を許容する単一選択。未選択は null として扱う */
export const optionalEnumField = <
  const T extends Readonly<Record<string, string>>,
>(
  values: T,
) =>
  z
    .union([z.literal(""), z.enum(values, "選択してください")])
    .optional()
    .transform((v) => (v ? v : null));

/** 未選択 / はい / いいえ の三択（select の値は "" / "true" / "false"） */
export const optionalBoolean = z
  .enum(["", "true", "false"], "選択してください")
  .optional()
  .transform((v) => (v ? v === "true" : null));

/** datetime-local の値を日本時間の Date に変換する */
export const jstDateTime = z
  .string("必須です")
  .trim()
  .min(1, "必須です")
  .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "日時の形式が正しくありません")
  .transform(parseJstDateTimeLocal)
  .pipe(z.date("日時の形式が正しくありません"));

/** 任意の URL。未入力は null として扱う */
export const optionalUrl = optionalText(500).pipe(
  z.url("URL の形式で入力してください").nullable(),
);
