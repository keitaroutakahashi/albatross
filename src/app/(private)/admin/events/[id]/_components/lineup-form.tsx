"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/app/_components/shadcn/button";
import { nativeControlClass } from "@/app/(private)/admin/_components/form-fields";
import { FormSection } from "@/app/(private)/admin/_components/form-section";
import { FormShell } from "@/app/(private)/admin/_components/form-shell";
import {
  LINEUP_FIELDS,
  MAX_BENCH,
  MAX_STARTERS,
  MIN_STARTERS,
  rowFieldName,
  STARTERS_ERROR_KEY,
} from "@/app/(private)/admin/_schemas/lineup";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import { positionShortOptions } from "@/app/(private)/admin/_utils/options";

type Option = { value: string; label: string };

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  members: Option[];
  /** 1 番から順の行。未登録の打順は空文字 */
  initialStarters: { memberId: string; position: string }[];
  initialBench: string[];
};

const toArray = (value: string | string[] | undefined): string[] =>
  value === undefined ? [] : Array.isArray(value) ? value : [value];

/** エラー再表示時は送信した値、初回は初期値を返す */
const rowValue = (
  state: ActionState,
  field: string,
  index: number,
  initial: string,
): string =>
  state.values ? (toArray(state.values[field])[index] ?? "") : initial;

type SelectProps = {
  state: ActionState;
  field: keyof typeof LINEUP_FIELDS;
  index: number;
  initial: string;
  options: Option[];
  placeholder: string;
  label: string;
};

/** 同名の select を並べて、送信順で行に対応づける */
const RowSelect = ({
  state,
  field,
  index,
  initial,
  options,
  placeholder,
  label,
}: SelectProps) => {
  const value = rowValue(state, field, index, initial);
  const error = state.fieldErrors?.[rowFieldName(field, index)];
  return (
    <select
      // エラー差し戻し後も選択を保つため、送信値が変わったら作り直す
      key={value}
      name={field}
      defaultValue={value}
      aria-label={label}
      aria-invalid={!!error}
      className={nativeControlClass}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
};

const AddRemove = ({
  count,
  min = 0,
  max,
  noun,
  onChange,
}: {
  count: number;
  /** これ以下には減らせない（「最後を削除」を押せなくする） */
  min?: number;
  max: number;
  noun: string;
  onChange: (next: number) => void;
}) => (
  <div className="flex gap-2">
    <Button
      type="button"
      variant="outline"
      className="h-11 flex-1"
      disabled={count >= max}
      onClick={() => onChange(count + 1)}
    >
      <Plus />
      {noun}を追加
    </Button>
    <Button
      type="button"
      variant="outline"
      className="h-11 flex-1"
      disabled={count <= min}
      onClick={() => onChange(count - 1)}
    >
      <Minus />
      最後を削除
    </Button>
  </div>
);

export const LineupForm = ({
  action,
  members,
  initialStarters,
  initialBench,
}: Props) => {
  const [starterCount, setStarterCount] = useState(initialStarters.length);
  const [benchCount, setBenchCount] = useState(initialBench.length);

  return (
    <FormShell action={action}>
      {(state) => {
        const rowError = (field: keyof typeof LINEUP_FIELDS, i: number) =>
          state.fieldErrors?.[rowFieldName(field, i)];

        return (
          <>
            <FormSection title="スタメン">
              <ol className="flex flex-col gap-3">
                {Array.from({ length: starterCount }, (_, i) => {
                  const errors = [
                    rowError("starterMember", i),
                    rowError("starterPosition", i),
                  ].filter(Boolean);
                  return (
                    // biome-ignore lint/suspicious/noArrayIndexKey: 打順そのものが行の識別子
                    <li key={i}>
                      <div className="grid grid-cols-[1.5rem_4.5rem_1fr] items-center gap-2">
                        <span className="text-sm font-bold">{i + 1}</span>
                        <RowSelect
                          state={state}
                          field="starterPosition"
                          index={i}
                          initial={initialStarters[i]?.position ?? ""}
                          options={positionShortOptions}
                          placeholder="-"
                          label={`${i + 1} 守備位置`}
                        />
                        <RowSelect
                          state={state}
                          field="starterMember"
                          index={i}
                          initial={initialStarters[i]?.memberId ?? ""}
                          options={members}
                          placeholder="選手名"
                          label={`${i + 1} 選手`}
                        />
                      </div>
                      {errors.map((message) => (
                        <p
                          key={message}
                          role="alert"
                          className="mt-1 pl-8 text-xs text-destructive"
                        >
                          {message}
                        </p>
                      ))}
                    </li>
                  );
                })}
              </ol>
              {state.fieldErrors?.[STARTERS_ERROR_KEY] && (
                <p role="alert" className="text-sm text-destructive">
                  {state.fieldErrors[STARTERS_ERROR_KEY]}
                </p>
              )}
              <AddRemove
                count={starterCount}
                min={MIN_STARTERS}
                max={MAX_STARTERS}
                noun="打順"
                onChange={setStarterCount}
              />
            </FormSection>

            <FormSection title="ベンチ">
              <ul className="flex flex-col gap-3">
                {Array.from({ length: benchCount }, (_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: 行の並びが識別子
                  <li key={i}>
                    <RowSelect
                      state={state}
                      field="benchMember"
                      index={i}
                      initial={initialBench[i] ?? ""}
                      options={members}
                      placeholder="選手名"
                      label={`ベンチ ${i + 1} 選手`}
                    />
                    {rowError("benchMember", i) && (
                      <p role="alert" className="mt-1 text-xs text-destructive">
                        {rowError("benchMember", i)}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
              {state.fieldErrors?.[LINEUP_FIELDS.benchMember] && (
                <p role="alert" className="text-sm text-destructive">
                  {state.fieldErrors[LINEUP_FIELDS.benchMember]}
                </p>
              )}
              <AddRemove
                count={benchCount}
                max={MAX_BENCH}
                noun="ベンチ"
                onChange={setBenchCount}
              />
            </FormSection>
          </>
        );
      }}
    </FormShell>
  );
};
