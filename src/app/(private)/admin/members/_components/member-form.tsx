"use client";

import {
  CheckboxField,
  CheckboxGroupField,
  SelectField,
  TextField,
} from "@/app/(private)/admin/_components/form-fields";
import { FormShell } from "@/app/(private)/admin/_components/form-shell";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import {
  batHandOptions,
  memberCategoryOptions,
  positionOptions,
  throwHandOptions,
} from "@/app/(private)/admin/_utils/options";
import type { MemberModel } from "@/generated/prisma/models/Member";

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  initial?: MemberModel;
  deleteTarget?: { name: string; action: () => Promise<ActionState> };
};

export const MemberForm = ({ action, initial, deleteTarget }: Props) => {
  return (
    <FormShell action={action} deleteTarget={deleteTarget}>
      {(state) => (
        <>
          <TextField
            name="name"
            label="名前"
            state={state}
            required
            maxLength={50}
            defaultValue={initial?.name}
          />
          <TextField
            name="uniformNumber"
            label="背番号"
            state={state}
            hint="助っ人は未入力でも登録できます"
            inputMode="numeric"
            maxLength={3}
            defaultValue={initial?.uniformNumber ?? undefined}
          />
          <SelectField
            name="position"
            label="メインポジション"
            state={state}
            required
            options={positionOptions}
            defaultValue={initial?.position ?? "pitcher"}
          />
          <CheckboxGroupField
            name="subPositions"
            label="サブポジション"
            state={state}
            options={positionOptions}
            defaultValue={initial?.subPositions}
          />
          <SelectField
            name="throwHand"
            label="投"
            state={state}
            required
            options={throwHandOptions}
            defaultValue={initial?.throwHand ?? "right"}
          />
          <SelectField
            name="batHand"
            label="打"
            state={state}
            required
            options={batHandOptions}
            defaultValue={initial?.batHand ?? "right"}
          />
          <SelectField
            name="category"
            label="メンバー区分"
            state={state}
            required
            options={memberCategoryOptions}
            defaultValue={initial?.category ?? "regular"}
          />
          <CheckboxField
            name="isActive"
            label="現役メンバー"
            state={state}
            defaultChecked={initial?.isActive ?? true}
          />
        </>
      )}
    </FormShell>
  );
};
