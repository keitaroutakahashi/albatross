"use client";

import { TextField } from "@/app/(private)/admin/_components/form-fields";
import { FormShell } from "@/app/(private)/admin/_components/form-shell";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import type { OpponentModel } from "@/generated/prisma/models/Opponent";

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  initial?: OpponentModel;
  deleteTarget?: { name: string; action: () => Promise<ActionState> };
};

export const OpponentForm = ({ action, initial, deleteTarget }: Props) => {
  return (
    <FormShell action={action} deleteTarget={deleteTarget}>
      {(state) => (
        <>
          <TextField
            name="name"
            label="チーム名"
            state={state}
            required
            maxLength={50}
            defaultValue={initial?.name}
          />
        </>
      )}
    </FormShell>
  );
};
