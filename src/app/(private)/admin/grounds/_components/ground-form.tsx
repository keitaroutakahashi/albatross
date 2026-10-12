"use client";

import {
  TextareaField,
  TextField,
} from "@/app/(private)/admin/_components/form-fields";
import { FormShell } from "@/app/(private)/admin/_components/form-shell";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import type { GroundModel } from "@/generated/prisma/models/Ground";

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  initial?: GroundModel;
  deleteTarget?: { name: string; action: () => Promise<ActionState> };
};

export const GroundForm = ({ action, initial, deleteTarget }: Props) => {
  return (
    <FormShell action={action} deleteTarget={deleteTarget}>
      {(state) => (
        <>
          <TextField
            name="name"
            label="グラウンド名"
            state={state}
            required
            maxLength={50}
            defaultValue={initial?.name}
          />
          <TextField
            name="address"
            label="住所"
            state={state}
            required
            maxLength={200}
            defaultValue={initial?.address}
          />
          <TextareaField
            name="access"
            label="アクセス"
            state={state}
            maxLength={500}
            defaultValue={initial?.access ?? ""}
          />
          <TextField
            name="url"
            label="公式サイト URL"
            state={state}
            required
            type="url"
            placeholder="https://"
            defaultValue={initial?.url}
          />
          <TextField
            name="imagePath"
            label="背景画像パス"
            state={state}
            hint="例: /images/grounds/yoyogi.jpg"
            maxLength={200}
            defaultValue={initial?.imagePath ?? ""}
          />
        </>
      )}
    </FormShell>
  );
};
