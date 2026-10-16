/** フォーム送信（Server Action）の結果。useActionState の state として使う */
export type ActionState = {
  message?: string;
  fieldErrors?: Record<string, string>;
  /** React 19 は送信後にフォームをリセットするため、入力値を返して復元する */
  values?: FormValues;
};

export type FormValues = Record<string, string | string[]>;

export const initialActionState: ActionState = {};
