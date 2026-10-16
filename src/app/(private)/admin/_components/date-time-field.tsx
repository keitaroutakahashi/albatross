"use client";

import { useState } from "react";
import { Input } from "@/app/_components/shadcn/input";
import {
  currentValue,
  errorId,
  Field,
  nativeControlClass,
} from "@/app/(private)/admin/_components/form-fields";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";

type Props = {
  name: string;
  label: string;
  state: ActionState;
  required?: boolean;
  /** "2026-10-25T09:00" 形式（日本時間） */
  defaultValue?: string;
};

/** 新規登録時に最初に選んでおく時刻 */
const DEFAULT_TIME = "10:00";

const hourOptions = Array.from({ length: 24 }, (_, h) => {
  const time = `${String(h).padStart(2, "0")}:00`;
  return { value: time, label: time };
});

/**
 * 日時を「日付」と「時刻（時間単位）」で入力する。
 * datetime-local の step 指定はブラウザ・端末で挙動が揃わず分が残るため、2 つに分けている。
 * サーバーへは name の hidden 入力で "YYYY-MM-DDTHH:mm" として送る。
 */
export const DateTimeField = ({
  name,
  label,
  state,
  required,
  defaultValue,
}: Props) => {
  const initial = currentValue(state, name, defaultValue);
  const [day, setDay] = useState(initial.slice(0, 10));
  const [time, setTime] = useState(initial.slice(11, 16) || DEFAULT_TIME);
  const error = state.fieldErrors?.[name];

  // 既存データに分（例: 9:30）があるとき、時間単位の選択肢だけでは保存時に丸めてしまうため、
  // その時刻を選択肢に加えて、触らなければ変わらないようにする
  const options =
    time && !hourOptions.some((o) => o.value === time)
      ? [...hourOptions, { value: time, label: time }].sort((a, b) =>
          a.value.localeCompare(b.value),
        )
      : hourOptions;

  return (
    <Field
      name={name}
      label={label}
      labelFor={`${name}-day`}
      required={required}
      error={error}
    >
      <input
        type="hidden"
        name={name}
        value={day && time ? `${day}T${time}` : ""}
      />
      <div className="grid grid-cols-[1fr_8rem] gap-2">
        <Input
          id={`${name}-day`}
          type="date"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          aria-label={`${label}（日付）`}
          aria-invalid={!!error}
          aria-describedby={error ? errorId(name) : undefined}
          className="h-11"
        />
        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          aria-label={`${label}（時刻）`}
          aria-invalid={!!error}
          className={nativeControlClass}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </Field>
  );
};
