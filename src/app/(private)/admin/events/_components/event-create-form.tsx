"use client";

import { useState } from "react";
import { DateTimeField } from "@/app/(private)/admin/_components/date-time-field";
import { SelectField } from "@/app/(private)/admin/_components/form-fields";
import { FormShell } from "@/app/(private)/admin/_components/form-shell";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import {
  eventTypeOptions,
  gameTypeOptions,
} from "@/app/(private)/admin/_utils/options";
import type { EventType } from "@/generated/prisma/enums";

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  seasons: { value: string; label: string }[];
};

/** 新規登録は最小限の項目だけ入力し、詳細は登録後の編集画面で入力する */
export const EventCreateForm = ({ action, seasons }: Props) => {
  const [type, setType] = useState<EventType>("game");

  return (
    <FormShell
      action={action}
      submitLabel={{ idle: "登録する", pending: "登録中…" }}
    >
      {(state) => (
        <>
          <SelectField
            name="type"
            label="種別"
            state={state}
            required
            options={eventTypeOptions}
            defaultValue={type}
            onChange={(value) => setType(value as EventType)}
          />
          <DateTimeField name="date" label="日時" state={state} required />
          <SelectField
            name="seasonId"
            label="シーズン"
            state={state}
            required
            options={seasons}
            defaultValue={seasons[0]?.value}
          />
          {type === "game" && (
            <SelectField
              name="gameType"
              label="試合種別"
              state={state}
              required
              options={gameTypeOptions}
              defaultValue="undecided"
            />
          )}
        </>
      )}
    </FormShell>
  );
};
