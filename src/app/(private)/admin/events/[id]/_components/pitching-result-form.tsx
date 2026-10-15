"use client";

import {
  CheckboxField,
  SelectField,
  TextField,
} from "@/app/(private)/admin/_components/form-fields";
import { FormShell } from "@/app/(private)/admin/_components/form-shell";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import { partialOutsOptions } from "@/app/(private)/admin/_utils/options";
import type { GameResult } from "@/generated/prisma/enums";

export type PitchingResultInitial = {
  gameMemberId: string;
  pitchingOrder: string;
  inningsPitched: string;
  partialOuts: string;
  earnedRuns: string;
  runs: string;
  strikeouts: string;
  walks: string;
  hitByPitches: string;
  hitsAllowed: string;
  homeRunsAllowed: string;
  pitchCount: string;
  isResponsible: boolean;
};

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  gameMembers: { value: string; label: string }[];
  initial?: PitchingResultInitial;
  /** 追加時の登板順の初期値。編集時は登録済みの値を使う */
  defaultPitchingOrder?: string;
  /** 試合の結果。勝ち投手・負け投手はこの結果で決まる */
  gameResult: GameResult | null;
  deleteTarget?: { name: string; action: () => Promise<ActionState> };
};

/** 回数以外の成績項目（すべて 0 以上の整数） */
const COUNT_FIELDS = [
  { name: "earnedRuns", label: "自責点" },
  { name: "runs", label: "失点" },
  { name: "strikeouts", label: "奪三振" },
  { name: "walks", label: "四球" },
  { name: "hitByPitches", label: "死球" },
  { name: "hitsAllowed", label: "被安打" },
  { name: "homeRunsAllowed", label: "被本塁打" },
] as const;

/** 勝ち投手・負け投手は、試合の結果から決まる */
const responsibleHint = {
  win: "試合に勝ったため、勝ち投手になります",
  lose: "試合に負けたため、負け投手になります",
  draw: "引き分けの試合には勝ち投手・負け投手がいないため、選べません",
  undecided: "試合の結果が入力されると、勝ち投手・負け投手が決まります",
} as const satisfies Record<GameResult | "undecided", string>;

export const PitchingResultForm = ({
  action,
  gameMembers,
  initial,
  defaultPitchingOrder,
  gameResult,
  deleteTarget,
}: Props) => {
  return (
    <FormShell action={action} deleteTarget={deleteTarget}>
      {(state) => (
        <>
          <SelectField
            name="gameMemberId"
            label="投手"
            state={state}
            required
            placeholder="選択してください"
            options={gameMembers}
            defaultValue={initial?.gameMemberId}
          />
          <TextField
            name="pitchingOrder"
            label="登板順"
            state={state}
            required
            type="number"
            inputMode="numeric"
            hint="先発は 1。他の投手と同じ番号は使えません"
            defaultValue={initial?.pitchingOrder ?? defaultPitchingOrder ?? "1"}
          />
          <div className="grid grid-cols-2 gap-3">
            <TextField
              name="inningsPitched"
              label="投球回（完了）"
              state={state}
              required
              type="number"
              inputMode="numeric"
              defaultValue={initial?.inningsPitched ?? "0"}
            />
            <SelectField
              name="partialOuts"
              label="途中のアウト数"
              state={state}
              placeholder="なし"
              help={
                <>
                  <p>イニングを完了した場合は、「なし」を選択してください。</p>
                  <p>
                    1アウトも取れずに降板した場合、「0」を選択してください。
                  </p>
                </>
              }
              options={partialOutsOptions}
              defaultValue={initial?.partialOuts}
            />
            {COUNT_FIELDS.map((f) => (
              <TextField
                key={f.name}
                name={f.name}
                label={f.label}
                state={state}
                required
                type="number"
                inputMode="numeric"
                defaultValue={initial?.[f.name] ?? "0"}
              />
            ))}
            <TextField
              name="pitchCount"
              label="球数"
              state={state}
              type="number"
              inputMode="numeric"
              defaultValue={initial?.pitchCount}
            />
          </div>
          <CheckboxField
            name="isResponsible"
            label="責任投手"
            state={state}
            hint={responsibleHint[gameResult ?? "undecided"]}
            disabled={gameResult === "draw"}
            defaultChecked={initial?.isResponsible}
          />
        </>
      )}
    </FormShell>
  );
};
