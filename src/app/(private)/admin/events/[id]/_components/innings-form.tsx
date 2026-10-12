"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/app/_components/shadcn/button";
import { Input } from "@/app/_components/shadcn/input";
import { FormShell } from "@/app/(private)/admin/_components/form-shell";
import { MAX_INNINGS } from "@/app/(private)/admin/_schemas/inning";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  /** 1 回から順の得点（文字列） */
  initial: { teamScore: string; opponentScore: string }[];
  /** 自チームが先攻か。表示順（上段・下段）の入れ替えに使う */
  isFirstBatting: boolean | null;
};

const toArray = (value: string | string[] | undefined): string[] =>
  value === undefined ? [] : Array.isArray(value) ? value : [value];

export const InningsForm = ({ action, initial, isFirstBatting }: Props) => {
  const [count, setCount] = useState(initial.length);
  const teamFirst = isFirstBatting !== false;

  return (
    <FormShell action={action}>
      {(state) => {
        const team = toArray(state.values?.teamScore);
        const opponent = toArray(state.values?.opponentScore);
        const error =
          state.fieldErrors?.teamScore ?? state.fieldErrors?.opponentScore;
        const columns = [
          {
            name: "teamScore",
            label: "自チーム",
            values: team,
            key: "teamScore" as const,
          },
          {
            name: "opponentScore",
            label: "相手",
            values: opponent,
            key: "opponentScore" as const,
          },
        ];
        const ordered = teamFirst ? columns : [...columns].reverse();

        return (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-muted-foreground">
              先攻を左、後攻を右に表示しています。試合結果の得点とは連動しません。
            </p>
            <div className="grid grid-cols-[3rem_1fr_1fr] items-center gap-x-3 gap-y-2">
              <span />
              {ordered.map((c) => (
                <span key={c.name} className="text-center text-xs font-medium">
                  {c.label}
                </span>
              ))}
              {Array.from({ length: count }, (_, i) => (
                <InningRow
                  // biome-ignore lint/suspicious/noArrayIndexKey: イニング番号そのものが行の識別子
                  key={i}
                  index={i}
                  columns={ordered}
                  state={state}
                  initial={initial}
                />
              ))}
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-11 flex-1"
                disabled={count >= MAX_INNINGS}
                onClick={() => setCount((c) => c + 1)}
              >
                <Plus />
                イニングを追加
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 flex-1"
                disabled={count === 0}
                onClick={() => setCount((c) => c - 1)}
              >
                <Minus />
                最終回を削除
              </Button>
            </div>
          </div>
        );
      }}
    </FormShell>
  );
};

type RowProps = {
  index: number;
  columns: {
    name: string;
    label: string;
    values: string[];
    key: "teamScore" | "opponentScore";
  }[];
  state: ActionState;
  initial: Props["initial"];
};

const InningRow = ({ index, columns, state, initial }: RowProps) => {
  return (
    <>
      <span className="text-sm font-medium">{index + 1}回</span>
      {columns.map((c) => (
        <Input
          key={c.name}
          name={c.name}
          type="number"
          inputMode="numeric"
          aria-label={`${index + 1}回 ${c.label}`}
          defaultValue={
            state.values
              ? (c.values[index] ?? "")
              : (initial[index]?.[c.key] ?? "0")
          }
          className="h-11 text-center"
        />
      ))}
    </>
  );
};
