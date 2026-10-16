"use client";

import { DateTimeField } from "@/app/(private)/admin/_components/date-time-field";
import {
  SelectField,
  TextField,
} from "@/app/(private)/admin/_components/form-fields";
import { FormShell } from "@/app/(private)/admin/_components/form-shell";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";

type Option = { value: string; label: string };

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  options: { seasons: Option[]; grounds: Option[] };
  initial: {
    date: string;
    seasonId: string;
    groundId: string;
    groundCourt: string;
    note: string;
    status: string;
    cancelReason: string;
  };
};

/** いつ・どこで。試合・練習で共通 */
export const EventScheduleForm = ({ action, options, initial }: Props) => {
  return (
    <FormShell action={action}>
      {(state) => (
        <>
          <DateTimeField
            name="date"
            label="日時"
            state={state}
            required
            defaultValue={initial.date}
          />
          <SelectField
            name="seasonId"
            label="シーズン"
            state={state}
            required
            options={options.seasons}
            defaultValue={initial.seasonId}
          />
          <SelectField
            name="groundId"
            label="グラウンド"
            state={state}
            placeholder="未選択"
            options={options.grounds}
            defaultValue={initial.groundId}
          />
          <TextField
            name="groundCourt"
            label="面"
            state={state}
            hint="例: A面"
            maxLength={50}
            defaultValue={initial.groundCourt}
          />
          <TextField
            name="note"
            label="備考"
            state={state}
            hint="イベント詳細の「備考」に表示されます"
            maxLength={200}
            defaultValue={initial.note}
          />
          {initial.status === "canceled" && (
            <TextField
              name="cancelReason"
              label="中止理由"
              state={state}
              hint="例: 雨天中止"
              maxLength={200}
              defaultValue={initial.cancelReason}
            />
          )}
        </>
      )}
    </FormShell>
  );
};
