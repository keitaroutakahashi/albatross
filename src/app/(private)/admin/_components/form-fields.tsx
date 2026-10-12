import type { ComponentProps, ReactNode } from "react";
import { Input } from "@/app/_components/shadcn/input";
import { Label } from "@/app/_components/shadcn/label";
import { Textarea } from "@/app/_components/shadcn/textarea";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string };

type BaseProps = {
  name: string;
  label: string;
  state: ActionState;
  required?: boolean;
  hint?: string;
};

export const nativeControlClass =
  "border-input h-11 w-full rounded-md border bg-transparent px-3 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive md:text-sm";

const errorId = (name: string) => `${name}-error`;

/**
 * select は React 19 のフォームリセットで、更新後の defaultValue ではなく初回マウント時の
 * 選択状態に戻ってしまう（input は更新後の defaultValue に戻る）。
 * エラー差し戻し後も送信値を保てるよう、送信値が変わったら select を作り直すための key を返す。
 */
export const selectResetKey = (state: ActionState, name: string): string =>
  state.values ? `submitted:${String(state.values[name] ?? "")}` : "initial";

const toArray = (value: string | string[] | undefined): string[] =>
  value === undefined ? [] : Array.isArray(value) ? value : [value];

/** エラー再表示時は送信した値、初回は初期値を表示する */
const currentValue = (
  state: ActionState,
  name: string,
  initial: string | undefined,
): string => {
  const submitted = state.values?.[name];
  if (typeof submitted === "string") return submitted;
  return initial ?? "";
};

const Field = ({
  name,
  label,
  required,
  hint,
  error,
  children,
}: Pick<BaseProps, "name" | "label" | "required" | "hint"> & {
  error?: string;
  children: ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-xs text-destructive">必須</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p id={errorId(name)} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};

type TextFieldProps = BaseProps & {
  defaultValue?: string;
  type?: "text" | "email" | "url" | "number" | "date" | "datetime-local";
  inputMode?: ComponentProps<"input">["inputMode"];
  placeholder?: string;
  maxLength?: number;
  /** type="number" で小数を許容するときに指定する */
  step?: string;
};

export const TextField = ({
  name,
  label,
  state,
  required,
  hint,
  defaultValue,
  type = "text",
  inputMode,
  placeholder,
  maxLength,
  step,
}: TextFieldProps) => {
  const error = state.fieldErrors?.[name];
  return (
    <Field
      name={name}
      label={label}
      required={required}
      hint={hint}
      error={error}
    >
      <Input
        id={name}
        name={name}
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        maxLength={maxLength}
        step={step}
        defaultValue={currentValue(state, name, defaultValue)}
        aria-invalid={!!error}
        aria-describedby={error ? errorId(name) : undefined}
        className="h-11"
      />
    </Field>
  );
};

export const TextareaField = ({
  name,
  label,
  state,
  required,
  hint,
  defaultValue,
  maxLength,
}: BaseProps & { defaultValue?: string; maxLength?: number }) => {
  const error = state.fieldErrors?.[name];
  return (
    <Field
      name={name}
      label={label}
      required={required}
      hint={hint}
      error={error}
    >
      <Textarea
        id={name}
        name={name}
        maxLength={maxLength}
        defaultValue={currentValue(state, name, defaultValue)}
        aria-invalid={!!error}
        aria-describedby={error ? errorId(name) : undefined}
      />
    </Field>
  );
};

/** モバイルでは OS ネイティブのピッカーが最も操作しやすいため native select を使う */
export const SelectField = ({
  name,
  label,
  state,
  required,
  hint,
  defaultValue,
  options,
  placeholder,
  onChange,
  disabled,
}: BaseProps & {
  defaultValue?: string;
  options: Option[];
  /** 指定すると未選択の選択肢を先頭に追加する */
  placeholder?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}) => {
  const error = state.fieldErrors?.[name];
  return (
    <Field
      name={name}
      label={label}
      required={required}
      hint={hint}
      error={error}
    >
      <select
        key={selectResetKey(state, name)}
        id={name}
        name={name}
        defaultValue={currentValue(state, name, defaultValue)}
        onChange={onChange && ((e) => onChange(e.target.value))}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? errorId(name) : undefined}
        className={nativeControlClass}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
};

const checkItemClass =
  "flex min-h-11 items-center gap-3 rounded-md border px-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5";

export const CheckboxField = ({
  name,
  label,
  state,
  hint,
  defaultChecked = false,
}: Omit<BaseProps, "required"> & { defaultChecked?: boolean }) => {
  // 未チェックの項目は送信されないため、エラー再表示時はキーの有無で判定する
  const checked = state.values ? state.values[name] === "on" : defaultChecked;
  return (
    <div className="flex flex-col gap-2">
      <label className={checkItemClass}>
        <input
          type="checkbox"
          name={name}
          defaultChecked={checked}
          className="size-5 accent-primary"
        />
        {label}
      </label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
};

export const CheckboxGroupField = ({
  name,
  label,
  state,
  hint,
  defaultValue = [],
  options,
}: Omit<BaseProps, "required"> & {
  defaultValue?: string[];
  options: Option[];
}) => {
  const error = state.fieldErrors?.[name];
  const selected = state.values ? toArray(state.values[name]) : defaultValue;
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm font-medium">{label}</legend>
      <div className="grid grid-cols-2 gap-2">
        {options.map((o) => (
          <label key={o.value} className={cn(checkItemClass)}>
            <input
              type="checkbox"
              name={name}
              value={o.value}
              defaultChecked={selected.includes(o.value)}
              className="size-5 accent-primary"
            />
            {o.label}
          </label>
        ))}
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </fieldset>
  );
};
