"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/app/_components/shadcn/button";
import { Input } from "@/app/_components/shadcn/input";
import { nativeControlClass } from "@/app/(private)/admin/_components/form-fields";
import { FormShell } from "@/app/(private)/admin/_components/form-shell";
import {
  AT_BAT_FIELDS,
  AT_BATS_ERROR_KEY,
  atBatFieldName,
  MAX_AT_BATS,
  NO_DIRECTION_RESULTS,
  NO_RBI_RESULTS,
} from "@/app/(private)/admin/_schemas/plate-appearance";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import {
  atBatResultGroups,
  positionShortOptions,
} from "@/app/(private)/admin/_utils/options";

/** 最初に表示する打席数。登録済みの打席が多いときは、その分まで表示する */
export const MIN_AT_BAT_ROWS = 3;

export type AtBatRowInitial = {
  inningNumber: string;
  result: string;
  direction: string;
  rbi: string;
  isScoringPosition: boolean;
};

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  /** 1 打席目から順の行。未登録の打席は空の値 */
  initialRows: AtBatRowInitial[];
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

const Labeled = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    {/* 入力欄には aria-label を付けているため、ここは表示のみ */}
    <span aria-hidden="true" className="text-xs text-muted-foreground">
      {label}
    </span>
    {children}
  </div>
);

type RowProps = {
  index: number;
  state: ActionState;
  initial: AtBatRowInitial | undefined;
};

const AtBatRow = ({ index, state, initial }: RowProps) => {
  const errors = (["inningNumber", "result", "direction", "rbi"] as const)
    .map((field) => state.fieldErrors?.[atBatFieldName(field, index)])
    .filter(Boolean);
  const result = rowValue(
    state,
    AT_BAT_FIELDS.result,
    index,
    initial?.result ?? "",
  );
  // 結果を選び直したらすぐ、打球方向・打点の入力欄を出し分ける
  const [selectedResult, setSelectedResult] = useState(result);
  const hasDirection = !(NO_DIRECTION_RESULTS as readonly string[]).includes(
    selectedResult,
  );
  const hasRbi = !(NO_RBI_RESULTS as readonly string[]).includes(
    selectedResult,
  );
  const direction = rowValue(
    state,
    AT_BAT_FIELDS.direction,
    index,
    initial?.direction ?? "",
  );
  const scoringChecked = state.values
    ? toArray(state.values[AT_BAT_FIELDS.isScoringPosition]).includes(
        String(index + 1),
      )
    : (initial?.isScoringPosition ?? false);

  return (
    <li className="flex flex-col gap-3 rounded-xl border p-3">
      <p className="text-sm font-bold">{index + 1}打席目</p>
      <div className="grid grid-cols-[5rem_1fr] gap-2">
        <Labeled label="イニング">
          <Input
            name={AT_BAT_FIELDS.inningNumber}
            type="number"
            inputMode="numeric"
            placeholder="回"
            aria-label={`${index + 1}打席目 イニング`}
            defaultValue={rowValue(
              state,
              AT_BAT_FIELDS.inningNumber,
              index,
              initial?.inningNumber ?? "",
            )}
            className="h-11"
          />
        </Labeled>
        <Labeled label="結果">
          <select
            // エラー差し戻し後も選択を保つため、送信値が変わったら作り直す
            key={result}
            name={AT_BAT_FIELDS.result}
            aria-label={`${index + 1}打席目 結果`}
            defaultValue={result}
            onChange={(e) => setSelectedResult(e.target.value)}
            className={nativeControlClass}
          >
            <option value="">選択</option>
            {atBatResultGroups.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </Labeled>
      </div>
      {/* 入力欄を出さない項目も、送信値が打席の並びとずれないよう空の値を送る */}
      {!hasDirection && (
        <input type="hidden" name={AT_BAT_FIELDS.direction} value="" />
      )}
      {!hasRbi && <input type="hidden" name={AT_BAT_FIELDS.rbi} value="0" />}
      {(hasDirection || hasRbi) && (
        <div className="flex gap-2">
          {hasDirection && (
            <div className="w-28 shrink-0">
              <Labeled label="打球方向">
                <select
                  key={direction}
                  name={AT_BAT_FIELDS.direction}
                  aria-label={`${index + 1}打席目 打球方向`}
                  defaultValue={direction}
                  className={nativeControlClass}
                >
                  <option value="">選択</option>
                  {positionShortOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Labeled>
            </div>
          )}
          {hasRbi && (
            <div className="w-20 shrink-0">
              <Labeled label="打点">
                <Input
                  name={AT_BAT_FIELDS.rbi}
                  aria-label={`${index + 1}打席目 打点`}
                  type="number"
                  inputMode="numeric"
                  defaultValue={rowValue(
                    state,
                    AT_BAT_FIELDS.rbi,
                    index,
                    initial?.rbi ?? "0",
                  )}
                  className="h-11"
                />
              </Labeled>
            </div>
          )}
        </div>
      )}
      <label className="flex min-h-11 items-center gap-3 rounded-md border px-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5">
        <input
          type="checkbox"
          name={AT_BAT_FIELDS.isScoringPosition}
          value={index + 1}
          defaultChecked={scoringChecked}
          className="size-5 accent-primary"
        />
        得点圏
      </label>
      {errors.map((message) => (
        <p key={message} role="alert" className="text-xs text-destructive">
          {message}
        </p>
      ))}
    </li>
  );
};

/** 1 人分の打席を並べて入力する。打席番号は行の位置で決まる */
export const PlateAppearancesForm = ({ action, initialRows }: Props) => {
  const [count, setCount] = useState(
    Math.max(MIN_AT_BAT_ROWS, initialRows.length),
  );

  return (
    <FormShell action={action}>
      {(state) => (
        <div className="flex flex-col gap-4">
          <ol className="flex flex-col gap-3">
            {Array.from({ length: count }, (_, i) => (
              <AtBatRow
                // biome-ignore lint/suspicious/noArrayIndexKey: 打席番号そのものが行の識別子
                key={i}
                index={i}
                state={state}
                initial={initialRows[i]}
              />
            ))}
          </ol>
          {state.fieldErrors?.[AT_BATS_ERROR_KEY] && (
            <p role="alert" className="text-sm text-destructive">
              {state.fieldErrors[AT_BATS_ERROR_KEY]}
            </p>
          )}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1"
              disabled={count >= MAX_AT_BATS}
              onClick={() => setCount((c) => c + 1)}
            >
              <Plus />
              打席を追加
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1"
              disabled={count <= 1}
              onClick={() => setCount((c) => c - 1)}
            >
              <Minus />
              最後を削除
            </Button>
          </div>
        </div>
      )}
    </FormShell>
  );
};
