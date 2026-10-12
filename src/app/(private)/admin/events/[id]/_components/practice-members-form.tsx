"use client";

import { CheckboxGroupField } from "@/app/(private)/admin/_components/form-fields";
import { FormShell } from "@/app/(private)/admin/_components/form-shell";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  options: { value: string; label: string }[];
  selected: string[];
};

export const PracticeMembersForm = ({ action, options, selected }: Props) => {
  return (
    <FormShell action={action}>
      {(state) => (
        <CheckboxGroupField
          name="memberIds"
          label="参加メンバー"
          state={state}
          options={options}
          defaultValue={selected}
        />
      )}
    </FormShell>
  );
};
