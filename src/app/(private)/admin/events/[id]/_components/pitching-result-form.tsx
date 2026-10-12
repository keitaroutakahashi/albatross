"use client";

import {
  SelectField,
  TextField,
} from "@/app/(private)/admin/_components/form-fields";
import { FormShell } from "@/app/(private)/admin/_components/form-shell";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import {
  partialOutsOptions,
  pitchingDecisionOptions,
} from "@/app/(private)/admin/_utils/options";

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
  decision: string;
};

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  gameMembers: { value: string; label: string }[];
  initial?: PitchingResultInitial;
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

export const PitchingResultForm = ({
  action,
  gameMembers,
  initial,
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
            hint="先発は 1"
            defaultValue={initial?.pitchingOrder ?? "1"}
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
          <SelectField
            name="decision"
            label="勝敗"
            state={state}
            placeholder="該当なし"
            options={pitchingDecisionOptions}
            defaultValue={initial?.decision}
          />
        </>
      )}
    </FormShell>
  );
};
