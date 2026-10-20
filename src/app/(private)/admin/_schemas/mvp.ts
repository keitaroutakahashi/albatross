import {
  optionalId,
  optionalText,
} from "@/app/(private)/admin/_schemas/fields";

/** MVP に添えるコメントの上限文字数 */
export const MVP_COMMENT_MAX = 500;

/** MVP 全体に関するエラーを紐づけるキー */
export const MVPS_ERROR_KEY = "mvps";

/** 入力欄は枠の並びで対応づける（表示順 = 枠の位置）。名前は配列として複数送られる */
export const MVP_FIELDS = {
  member: "mvpMember",
  comment: "mvpComment",
} as const;

/** 枠ごとのエラーを紐づけるフィールド名（0 始まりの枠番号） */
export const mvpFieldName = (field: keyof typeof MVP_FIELDS, index: number) =>
  `${MVP_FIELDS[field]}-${index}`;

export type MvpEntry = {
  memberId: number;
  /** 表示順（1 から） */
  order: number;
  comment: string | null;
};

type Result =
  | { success: true; entries: MvpEntry[] }
  | { success: false; fieldErrors: Record<string, string> };

const strings = (formData: FormData, name: string): string[] =>
  formData.getAll(name).filter((v): v is string => typeof v === "string");

const memberSchema = optionalId;
const commentSchema = optionalText(MVP_COMMENT_MAX);

/**
 * MVP フォームの入力を検証する。
 * 選手が未選択の枠は「その枠は使わない」として結果に含めない。表示順は、使った枠の並びで 1 から振る。
 */
export const parseMvps = (formData: FormData): Result => {
  const members = strings(formData, MVP_FIELDS.member);
  const comments = strings(formData, MVP_FIELDS.comment);

  const fieldErrors: Record<string, string> = {};
  const entries: MvpEntry[] = [];
  const used = new Set<number>();

  members.forEach((rawMember, i) => {
    const memberKey = mvpFieldName("member", i);
    const commentKey = mvpFieldName("comment", i);
    const member = memberSchema.safeParse(rawMember);
    const comment = commentSchema.safeParse(comments[i] ?? "");

    if (!comment.success) {
      fieldErrors[commentKey] = comment.error.issues[0].message;
    }
    if (!member.success) {
      fieldErrors[memberKey] = "選手を選択してください";
      return;
    }
    if (member.data === null) {
      // コメントだけ書いて選手が空だと、コメントが黙って消えてしまう
      if (comment.success && comment.data !== null) {
        fieldErrors[memberKey] = "選手を選択してください";
      }
      return;
    }
    if (used.has(member.data)) {
      fieldErrors[memberKey] = "同じ選手が複数回選ばれています";
      return;
    }
    used.add(member.data);

    if (comment.success) {
      entries.push({
        memberId: member.data,
        order: entries.length + 1,
        comment: comment.data,
      });
    }
  });

  return Object.keys(fieldErrors).length > 0
    ? { success: false, fieldErrors }
    : { success: true, entries };
};
