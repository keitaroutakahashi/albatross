"use client";

import {
  CheckboxField,
  SelectField,
  TextField,
} from "@/app/(private)/admin/_components/form-fields";
import { FormShell } from "@/app/(private)/admin/_components/form-shell";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import {
  atBatResultOptions,
  positionOptions,
} from "@/app/(private)/admin/_utils/options";

export type PlateAppearanceInitial = {
  gameMemberId: string;
  inningNumber: string;
  atBatInGame: string;
  result: string;
  direction: string;
  rbi: string;
  isScoringPosition: boolean;
};

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  gameMembers: { value: string; label: string }[];
  initial?: PlateAppearanceInitial;
  deleteTarget?: { name: string; action: () => Promise<ActionState> };
};

export const PlateAppearanceForm = ({
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
            label="選手"
            state={state}
            required
            placeholder="選択してください"
            options={gameMembers}
            defaultValue={initial?.gameMemberId}
          />
          <TextField
            name="atBatInGame"
            label="打席番号"
            state={state}
            required
            type="number"
            inputMode="numeric"
            hint="その選手の何打席目か（1, 2, 3…）"
            defaultValue={initial?.atBatInGame}
          />
          <TextField
            name="inningNumber"
            label="イニング"
            state={state}
            required
            type="number"
            inputMode="numeric"
            hint="何回の打席か"
            defaultValue={initial?.inningNumber}
          />
          <SelectField
            name="result"
            label="結果"
            state={state}
            required
            placeholder="選択してください"
            options={atBatResultOptions}
            defaultValue={initial?.result}
          />
          <SelectField
            name="direction"
            label="打球方向"
            state={state}
            placeholder="なし"
            hint="四球・三振・死球は不要です"
            options={positionOptions}
            defaultValue={initial?.direction}
          />
          <TextField
            name="rbi"
            label="打点"
            state={state}
            required
            type="number"
            inputMode="numeric"
            defaultValue={initial?.rbi ?? "0"}
          />
          <CheckboxField
            name="isScoringPosition"
            label="得点圏（二塁または三塁に走者）での打席"
            state={state}
            defaultChecked={initial?.isScoringPosition}
          />
        </>
      )}
    </FormShell>
  );
};
