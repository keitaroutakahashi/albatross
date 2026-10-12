"use client";

import { TextField } from "@/app/(private)/admin/_components/form-fields";
import { FormSection } from "@/app/(private)/admin/_components/form-section";
import { FormShell } from "@/app/(private)/admin/_components/form-shell";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import type { EventFormInitial } from "@/app/(private)/admin/events/_components/event-form-initial";

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  initial: EventFormInitial;
};

/** 自チーム・相手チームの同じ項目を横に並べる */
const PairRow = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-2 gap-3">{children}</div>
);

/** 「自 - 相手」の表記。どちらかが未入力なら未入力として扱う */
const pair = (team: string, opponent: string) =>
  team === "" || opponent === "" ? "未入力" : `${team} - ${opponent}`;

/**
 * 試合結果。得点・献上点は「イニングごとの得点」の入力から自動で設定されるため、
 * ここでは表示のみとし、安打・失策だけを手入力する。試合のときだけ使う。
 */
export const EventResultForm = ({ action, initial }: Props) => {
  return (
    <FormShell action={action}>
      {(state) => (
        <FormSection title="試合結果">
          <dl className="flex flex-col gap-2 rounded-md bg-muted px-3 py-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">得点（自 - 相手）</dt>
              <dd className="font-bold">
                {pair(initial.teamScore, initial.opponentScore)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">献上点（自 - 相手）</dt>
              <dd className="font-bold">
                {pair(initial.teamForfeitedRuns, initial.opponentForfeitedRuns)}
              </dd>
            </div>
            <p className="text-xs text-muted-foreground">
              「イニングごとの得点」の入力から自動で設定されます。
            </p>
          </dl>
          <PairRow>
            <TextField
              name="teamHits"
              label="安打（自）"
              state={state}
              type="number"
              inputMode="numeric"
              defaultValue={initial.teamHits}
            />
            <TextField
              name="opponentHits"
              label="安打（相手）"
              state={state}
              type="number"
              inputMode="numeric"
              defaultValue={initial.opponentHits}
            />
            <TextField
              name="teamErrors"
              label="失策（自）"
              state={state}
              type="number"
              inputMode="numeric"
              defaultValue={initial.teamErrors}
            />
            <TextField
              name="opponentErrors"
              label="失策（相手）"
              state={state}
              type="number"
              inputMode="numeric"
              defaultValue={initial.opponentErrors}
            />
          </PairRow>
        </FormSection>
      )}
    </FormShell>
  );
};
