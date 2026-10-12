"use client";

import { useState } from "react";
import { Input } from "@/app/_components/shadcn/input";
import {
  nativeControlClass,
  selectResetKey,
} from "@/app/(private)/admin/_components/form-fields";
import { FormShell } from "@/app/(private)/admin/_components/form-shell";
import { lineupFieldName } from "@/app/(private)/admin/_schemas/lineup";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import {
  memberTypeOptions,
  positionOptions,
} from "@/app/(private)/admin/_utils/options";
import { cn } from "@/lib/utils";

export type LineupInitial = {
  memberType: string;
  battingOrder: string;
  position: string;
  stolenBases: string;
};

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  members: { id: number; label: string; initial: LineupInitial }[];
};

export const LineupForm = ({ action, members }: Props) => {
  return (
    <FormShell action={action}>
      {(state) => (
        <ul className="flex flex-col gap-3">
          {members.map((m) => (
            <LineupRow key={m.id} {...m} state={state} />
          ))}
        </ul>
      )}
    </FormShell>
  );
};

const fieldValue = (
  state: ActionState,
  name: string,
  initial: string,
): string => {
  const submitted = state.values?.[name];
  return typeof submitted === "string"
    ? submitted
    : state.values
      ? ""
      : initial;
};

const LineupRow = ({
  id,
  label,
  initial,
  state,
}: Props["members"][number] & { state: ActionState }) => {
  const typeName = lineupFieldName("memberType", id);
  const orderName = lineupFieldName("battingOrder", id);
  const positionName = lineupFieldName("position", id);
  const stolenName = lineupFieldName("stolenBases", id);
  const [type, setType] = useState(
    fieldValue(state, typeName, initial.memberType),
  );

  const errors = state.fieldErrors ?? {};
  const field = (name: string, text: string, control: React.ReactNode) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-xs text-muted-foreground">
        {text}
      </label>
      {control}
      {errors[name] && (
        <p role="alert" className="text-xs text-destructive">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <li
      className={cn(
        "flex flex-col gap-3 rounded-lg border p-3",
        type !== "" && "border-primary/40 bg-primary/5",
      )}
    >
      <p className="font-medium">{label}</p>
      <div className="grid grid-cols-2 gap-3">
        {field(
          typeName,
          "出場",
          <select
            key={selectResetKey(state, typeName)}
            id={typeName}
            name={typeName}
            defaultValue={fieldValue(state, typeName, initial.memberType)}
            onChange={(e) => setType(e.target.value)}
            aria-invalid={!!errors[typeName]}
            className={nativeControlClass}
          >
            <option value="">出場なし</option>
            {memberTypeOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>,
        )}
        {type !== "" &&
          field(
            stolenName,
            "盗塁",
            <Input
              id={stolenName}
              name={stolenName}
              type="number"
              inputMode="numeric"
              defaultValue={fieldValue(state, stolenName, initial.stolenBases)}
              className="h-11"
            />,
          )}
        {type === "starting" && (
          <>
            {field(
              orderName,
              "打順",
              <Input
                id={orderName}
                name={orderName}
                type="number"
                inputMode="numeric"
                defaultValue={fieldValue(
                  state,
                  orderName,
                  initial.battingOrder,
                )}
                aria-invalid={!!errors[orderName]}
                className="h-11"
              />,
            )}
            {field(
              positionName,
              "守備",
              <select
                key={selectResetKey(state, positionName)}
                id={positionName}
                name={positionName}
                defaultValue={fieldValue(state, positionName, initial.position)}
                aria-invalid={!!errors[positionName]}
                className={nativeControlClass}
              >
                <option value="">選択</option>
                {positionOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>,
            )}
          </>
        )}
      </div>
    </li>
  );
};
