"use client";

import { TextField } from "@/app/(private)/admin/_components/form-fields";
import { FormShell } from "@/app/(private)/admin/_components/form-shell";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import type { SeasonModel } from "@/generated/prisma/models/Season";

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  initial?: SeasonModel;
  deleteTarget?: { name: string; action: () => Promise<ActionState> };
};

export const SeasonForm = ({ action, initial, deleteTarget }: Props) => {
  return (
    <FormShell action={action} deleteTarget={deleteTarget}>
      {(state) => (
        <>
          <TextField
            name="season"
            label="年度"
            state={state}
            required
            type="number"
            inputMode="numeric"
            placeholder="2026"
            defaultValue={initial?.season.toString()}
          />
          <TextField
            name="name"
            label="名称"
            state={state}
            maxLength={50}
            defaultValue={initial?.name ?? ""}
          />
        </>
      )}
    </FormShell>
  );
};
