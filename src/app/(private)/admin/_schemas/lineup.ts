import { z } from "zod";
import {
  optionalEnumField,
  optionalInt,
} from "@/app/(private)/admin/_schemas/fields";
import { MemberType, Position } from "@/generated/prisma/enums";

export const MAX_BATTING_ORDER = 20;

/** フィールド名は 1 メンバーごとに "<項目>-<memberId>" で送られる */
export const lineupFieldName = (field: LineupField, memberId: number) =>
  `${field}-${memberId}`;

type LineupField = "memberType" | "battingOrder" | "position" | "stolenBases";

const lineupRowSchema = z.object({
  memberType: optionalEnumField(MemberType),
  battingOrder: optionalInt(1, MAX_BATTING_ORDER),
  position: optionalEnumField(Position),
  stolenBases: optionalInt(0, 99),
});

export type LineupEntry = {
  memberId: number;
  memberType: MemberType;
  /** ベンチは null */
  battingOrder: number | null;
  position: Position | null;
  stolenBases: number;
};

type Result =
  | { success: true; entries: LineupEntry[] }
  | { success: false; fieldErrors: Record<string, string> };

/**
 * 出場した選手フォームの入力を検証する。
 * 「出場なし」のメンバーは結果に含めない（呼び出し側で除外・削除する）。
 */
export const parseLineup = (
  formData: FormData,
  memberIds: number[],
): Result => {
  const fieldErrors: Record<string, string> = {};
  const entries: LineupEntry[] = [];

  for (const memberId of memberIds) {
    const raw = Object.fromEntries(
      (["memberType", "battingOrder", "position", "stolenBases"] as const).map(
        (field) => {
          const value = formData.get(lineupFieldName(field, memberId));
          return [field, typeof value === "string" ? value : undefined];
        },
      ),
    );

    const parsed = lineupRowSchema.safeParse(raw);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = String(issue.path[0]) as LineupField;
        fieldErrors[lineupFieldName(field, memberId)] ??= issue.message;
      }
      continue;
    }

    const { memberType, battingOrder, position, stolenBases } = parsed.data;
    if (memberType === null) continue;

    if (memberType === "starting") {
      if (battingOrder === null) {
        fieldErrors[lineupFieldName("battingOrder", memberId)] =
          "打順を入力してください";
      }
      if (position === null) {
        fieldErrors[lineupFieldName("position", memberId)] =
          "守備位置を選択してください";
      }
    }

    entries.push({
      memberId,
      memberType,
      // ベンチは打順・守備位置を持たない
      battingOrder: memberType === "starting" ? battingOrder : null,
      position: memberType === "starting" ? position : null,
      stolenBases: stolenBases ?? 0,
    });
  }

  // 打順の重複（スターティングメンバー内）
  const seen = new Map<number, number>();
  for (const e of entries) {
    if (e.battingOrder === null) continue;
    if (seen.has(e.battingOrder)) {
      fieldErrors[lineupFieldName("battingOrder", e.memberId)] =
        "打順が重複しています";
    }
    seen.set(e.battingOrder, e.memberId);
  }

  return Object.keys(fieldErrors).length > 0
    ? { success: false, fieldErrors }
    : { success: true, entries };
};
