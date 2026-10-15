import { positionLabel } from "@/app/_constants/labels";
import {
  optionalEnumField,
  optionalId,
} from "@/app/(private)/admin/_schemas/fields";
import type { MemberType } from "@/generated/prisma/enums";
import { Position } from "@/generated/prisma/enums";

export const MIN_STARTERS = 9;
export const MAX_STARTERS = 20;
export const MAX_BENCH = 20;

/** 打順リスト全体に関するエラーを紐づけるキー */
export const STARTERS_ERROR_KEY = "starters";

/** 指名打者（DH）以外の守備位置。スタメンで 1 人ずつ必要 */
const FIELDING_POSITIONS = Object.values(Position).filter((p) => p !== "dh");

/** 入力欄は行の並びで対応づける（打順 = 行の位置 + 1）。名前は配列として複数送られる */
export const LINEUP_FIELDS = {
  starterMember: "starterMember",
  starterPosition: "starterPosition",
  benchMember: "benchMember",
} as const;

/** 行ごとのエラーを紐づけるフィールド名（0 始まりの行番号） */
export const rowFieldName = (
  field: keyof typeof LINEUP_FIELDS,
  index: number,
) => `${field}-${index}`;

export type LineupEntry = {
  memberId: number;
  memberType: MemberType;
  /** ベンチは null */
  battingOrder: number | null;
  position: Position | null;
};

type Result =
  | { success: true; entries: LineupEntry[] }
  | { success: false; fieldErrors: Record<string, string> };

const strings = (formData: FormData, name: string): string[] =>
  formData.getAll(name).filter((v): v is string => typeof v === "string");

const memberSchema = optionalId;
const positionSchema = optionalEnumField(Position);

/**
 * オーダーフォームの入力を検証する。
 * 選手が未選択の行は「その打順は未登録」として結果に含めない。
 */
export const parseLineup = (formData: FormData): Result => {
  const fieldErrors: Record<string, string> = {};
  const entries: LineupEntry[] = [];
  const used = new Set<number>();
  const usedPositions = new Set<Position>();

  const claim = (memberId: number, key: string) => {
    if (used.has(memberId)) {
      fieldErrors[key] = "同じ選手が複数回選ばれています";
      return false;
    }
    used.add(memberId);
    return true;
  };

  const members = strings(formData, LINEUP_FIELDS.starterMember);
  const positions = strings(formData, LINEUP_FIELDS.starterPosition);
  if (members.length > MAX_STARTERS) {
    return {
      success: false,
      fieldErrors: { [STARTERS_ERROR_KEY]: "打順が多すぎます" },
    };
  }

  members.forEach((rawMember, i) => {
    const memberKey = rowFieldName("starterMember", i);
    const positionKey = rowFieldName("starterPosition", i);
    const member = memberSchema.safeParse(rawMember);
    const position = positionSchema.safeParse(positions[i] ?? "");

    if (!member.success || !position.success) {
      if (!member.success) fieldErrors[memberKey] = "選手を選択してください";
      if (!position.success)
        fieldErrors[positionKey] = "守備位置を選択してください";
      return;
    }

    const memberId = member.data;
    const positionValue = position.data;
    if (memberId === null && positionValue === null) return;
    if (memberId === null) {
      fieldErrors[memberKey] = "選手を選択してください";
      return;
    }
    if (positionValue === null) {
      fieldErrors[positionKey] = "守備位置を選択してください";
      return;
    }
    if (!claim(memberId, memberKey)) return;
    // DH 以外の守備位置は 1 人ずつ。先に選ばれていれば後の行を重複とする
    if (positionValue !== "dh") {
      if (usedPositions.has(positionValue)) {
        fieldErrors[positionKey] = "守備位置が重複しています";
        return;
      }
      usedPositions.add(positionValue);
    }

    entries.push({
      memberId,
      memberType: "starting",
      battingOrder: i + 1,
      position: positionValue,
    });
  });

  const bench = strings(formData, LINEUP_FIELDS.benchMember);
  if (bench.length > MAX_BENCH) {
    return {
      success: false,
      fieldErrors: { [LINEUP_FIELDS.benchMember]: "ベンチが多すぎます" },
    };
  }

  bench.forEach((rawMember, i) => {
    const key = rowFieldName("benchMember", i);
    const member = memberSchema.safeParse(rawMember);
    if (!member.success) {
      fieldErrors[key] = "選手を選択してください";
      return;
    }
    if (member.data === null || !claim(member.data, key)) return;

    entries.push({
      memberId: member.data,
      memberType: "bench",
      battingOrder: null,
      position: null,
    });
  });

  // 行ごとのエラーを直してもらってから、打順全体の条件を確認する
  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  // 何も選ばれていなければ「オーダーを登録しない」だけなので許可する
  if (entries.length === 0) return { success: true, entries };

  const starterCount = entries.filter(
    (e) => e.memberType === "starting",
  ).length;
  if (starterCount < MIN_STARTERS) {
    return {
      success: false,
      fieldErrors: {
        [STARTERS_ERROR_KEY]: `スタメンは${MIN_STARTERS}人以上にしてください`,
      },
    };
  }

  const missing = FIELDING_POSITIONS.filter((p) => !usedPositions.has(p));
  if (missing.length > 0) {
    return {
      success: false,
      fieldErrors: {
        [STARTERS_ERROR_KEY]: `守備位置が足りません（${missing
          .map((p) => positionLabel[p])
          .join("・")}）`,
      },
    };
  }

  return { success: true, entries };
};
