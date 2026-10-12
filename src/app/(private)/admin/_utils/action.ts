import { revalidatePath } from "next/cache";
import type { z } from "zod";
import type {
  ActionState,
  FormValues,
} from "@/app/(private)/admin/_utils/action-state";
import { Prisma } from "@/generated/prisma/client";

const formDataToValues = (formData: FormData): FormValues => {
  const values: FormValues = {};
  for (const key of new Set(formData.keys())) {
    // Next.js が付与する $ACTION_ 系の内部フィールドは除外する
    if (key.startsWith("$ACTION_")) continue;
    const all = formData.getAll(key).filter((v) => typeof v === "string");
    values[key] = all.length > 1 ? all : (all[0] ?? "");
  }
  return values;
};

type ParseResult<S extends z.ZodType> =
  | { success: true; data: z.output<S> }
  | { success: false; state: ActionState };

export const parseForm = <S extends z.ZodType>(
  schema: S,
  formData: FormData,
): ParseResult<S> => {
  const values = formDataToValues(formData);
  const result = schema.safeParse(values);
  if (result.success) return { success: true, data: result.data };

  const fieldErrors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return {
    success: false,
    state: { message: "入力内容を確認してください", fieldErrors, values },
  };
};

/** DB を参照する検証など、スキーマ外のフィールドエラーを返す */
export const toFieldErrorState = (
  formData: FormData,
  fieldErrors: Record<string, string>,
): ActionState => ({
  message: "入力内容を確認してください",
  fieldErrors,
  values: formDataToValues(formData),
});

type FailureOptions = {
  /** 一意制約違反（P2002）を紐づけるフィールド名 */
  uniqueField?: string;
};

/** DB 更新時の例外をフォームに表示できる形へ変換する。想定外のエラーは再 throw する */
export const toFailureState = (
  error: unknown,
  formData: FormData,
  { uniqueField }: FailureOptions = {},
): ActionState => {
  const values = formDataToValues(formData);
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return uniqueField
        ? {
            message: "入力内容を確認してください",
            fieldErrors: { [uniqueField]: "既に登録されています" },
            values,
          }
        : { message: "既に登録されています", values };
    }
    if (error.code === "P2003") {
      return { message: "関連するデータが存在しません", values };
    }
    if (error.code === "P2025") {
      return { message: "データが見つかりません", values };
    }
  }
  throw error;
};

/** 削除時の例外を変換する。他データから参照されている場合は削除できない */
export const toDeleteFailureState = (error: unknown): ActionState => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2003") {
      return { message: "他のデータで使用中のため削除できません" };
    }
    if (error.code === "P2025") {
      return { message: "データが見つかりません" };
    }
  }
  throw error;
};

/** 管理画面での更新を公開ページにも反映させる */
export const revalidateAll = () => {
  revalidatePath("/", "layout");
};
