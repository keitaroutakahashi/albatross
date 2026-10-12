"use client";

import { TextField } from "@/app/(private)/admin/_components/form-fields";
import { FormShell } from "@/app/(private)/admin/_components/form-shell";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import type { UserModel } from "@/generated/prisma/models/User";

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  initial?: UserModel;
  deleteTarget?: { name: string; action: () => Promise<ActionState> };
};

export const UserForm = ({ action, initial, deleteTarget }: Props) => {
  return (
    <FormShell action={action} deleteTarget={deleteTarget}>
      {(state) => (
        <>
          <TextField
            name="email"
            label="メールアドレス"
            state={state}
            required
            type="email"
            inputMode="email"
            defaultValue={initial?.email}
          />
          <TextField
            name="name"
            label="名前"
            state={state}
            maxLength={50}
            defaultValue={initial?.name ?? ""}
          />
        </>
      )}
    </FormShell>
  );
};
