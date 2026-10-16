"use client";

import {
  SelectField,
  TextField,
} from "@/app/(private)/admin/_components/form-fields";
import { FormShell } from "@/app/(private)/admin/_components/form-shell";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import { userRoleOptions } from "@/app/(private)/admin/_utils/options";
import type { UserModel } from "@/generated/prisma/models/User";

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  initial?: UserModel & { member: { id: number } | null };
  members: { id: number; name: string; uniformNumber: string }[];
  deleteTarget?: { name: string; action: () => Promise<ActionState> };
};

export const UserForm = ({ action, initial, members, deleteTarget }: Props) => {
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
          <SelectField
            name="role"
            label="権限"
            state={state}
            required
            options={userRoleOptions}
            defaultValue={initial?.role ?? "general"}
          />
          <SelectField
            name="memberId"
            label="紐づける選手"
            state={state}
            hint="試合に出ない運営などは未選択のままで構いません"
            placeholder="紐づけない"
            options={members.map((m) => ({
              value: String(m.id),
              label: `#${m.uniformNumber} ${m.name}`,
            }))}
            defaultValue={initial?.member ? String(initial.member.id) : ""}
          />
        </>
      )}
    </FormShell>
  );
};
