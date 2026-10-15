"use client";

import { useState } from "react";
import { Textarea } from "@/app/_components/shadcn/textarea";
import { AddRemoveButtons } from "@/app/(private)/admin/_components/add-remove-buttons";
import { nativeControlClass } from "@/app/(private)/admin/_components/form-fields";
import {
  MAX_MVPS,
  MVP_COMMENT_MAX,
  MVP_FIELDS,
  MVPS_ERROR_KEY,
  mvpFieldName,
} from "@/app/(private)/admin/_schemas/mvp";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";

type Props = {
  state: ActionState;
  /** 選べる選手（その試合の参加メンバー） */
  candidates: { value: string; label: string }[];
  /** 保存済みの MVP。表示順に並べる */
  initial: { memberId: string; comment: string }[];
};

const toArray = (value: string | string[] | undefined): string[] =>
  value === undefined ? [] : Array.isArray(value) ? value : [value];

/** エラー再表示時は送信した値、初回は初期値を返す */
const slotValue = (
  state: ActionState,
  field: keyof typeof MVP_FIELDS,
  index: number,
  initial: string,
): string =>
  state.values
    ? (toArray(state.values[MVP_FIELDS[field]])[index] ?? "")
    : initial;

/**
 * MVP を、枠ごとのセレクトボックスで選ぶ。枠の順番が、そのまま表示順になる。
 * 選手を選ばなかった枠は使わない枠として扱う。
 */
export const MvpField = ({ state, candidates, initial }: Props) => {
  const [count, setCount] = useState(Math.max(1, initial.length));

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-3">
        {Array.from({ length: count }, (_, i) => {
          const member = slotValue(
            state,
            "member",
            i,
            initial[i]?.memberId ?? "",
          );
          const comment = slotValue(
            state,
            "comment",
            i,
            initial[i]?.comment ?? "",
          );
          const memberError = state.fieldErrors?.[mvpFieldName("member", i)];
          const commentError = state.fieldErrors?.[mvpFieldName("comment", i)];
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: 枠の位置が表示順そのもの
            <li key={i} className="flex flex-col gap-2 rounded-md border p-3">
              <p className="text-sm font-bold">{i + 1}人目</p>
              <select
                // エラー差し戻し後も選択を保つため、送信値が変わったら作り直す
                key={member}
                name={MVP_FIELDS.member}
                defaultValue={member}
                aria-label={`MVP ${i + 1}人目の選手`}
                aria-invalid={!!memberError}
                className={nativeControlClass}
              >
                <option value="">選手を選択</option>
                {candidates.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              {memberError && (
                <p role="alert" className="text-xs text-destructive">
                  {memberError}
                </p>
              )}
              <Textarea
                name={MVP_FIELDS.comment}
                aria-label={`MVP ${i + 1}人目へのコメント`}
                placeholder="コメント（任意）"
                maxLength={MVP_COMMENT_MAX}
                defaultValue={comment}
                aria-invalid={!!commentError}
              />
              {commentError && (
                <p role="alert" className="text-xs text-destructive">
                  {commentError}
                </p>
              )}
            </li>
          );
        })}
      </ul>
      {state.fieldErrors?.[MVPS_ERROR_KEY] && (
        <p role="alert" className="text-sm text-destructive">
          {state.fieldErrors[MVPS_ERROR_KEY]}
        </p>
      )}
      <AddRemoveButtons
        count={count}
        min={1}
        max={MAX_MVPS}
        noun="MVP"
        onChange={setCount}
      />
    </div>
  );
};
