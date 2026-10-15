"use client";

import {
  SegmentedField,
  SelectField,
} from "@/app/(private)/admin/_components/form-fields";
import { FormShell } from "@/app/(private)/admin/_components/form-shell";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import {
  firstBattingOptions,
  gameTypeOptions,
} from "@/app/(private)/admin/_utils/options";

type Option = { value: string; label: string };

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  options: { opponents: Option[]; leagues: Option[] };
  initial: {
    opponentId: string;
    leagueId: string;
    gameType: string;
    isFirstBatting: string;
  };
};

/** 未定は、選ぶ前の状態に戻すための選択肢なので、先頭に置く */
const gameTypeSegments = [
  ...gameTypeOptions.filter((o) => o.value === "undecided"),
  ...gameTypeOptions.filter((o) => o.value !== "undecided"),
];

const firstBattingSegments = [
  { value: "", label: "未定" },
  ...firstBattingOptions,
];

/** 対戦（試合のみ） */
export const EventMatchupForm = ({ action, options, initial }: Props) => {
  return (
    <FormShell action={action}>
      {(state) => (
        <>
          <SelectField
            name="opponentId"
            label="対戦相手"
            state={state}
            placeholder="未選択"
            options={options.opponents}
            defaultValue={initial.opponentId}
          />
          <SelectField
            name="leagueId"
            label="リーグ"
            state={state}
            placeholder="未選択"
            options={options.leagues}
            defaultValue={initial.leagueId}
          />
          <SegmentedField
            name="gameType"
            label="試合種別"
            state={state}
            required
            options={gameTypeSegments}
            defaultValue={initial.gameType}
          />
          <SegmentedField
            name="isFirstBatting"
            label="先攻・後攻"
            state={state}
            options={firstBattingSegments}
            defaultValue={initial.isFirstBatting}
          />
        </>
      )}
    </FormShell>
  );
};
