import { z } from "zod";
import {
  parseForm,
  toDeleteFailureState,
  toFailureState,
} from "@/app/(private)/admin/_utils/action";
import { Prisma } from "@/generated/prisma/client";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const knownError = (code: string) =>
  new Prisma.PrismaClientKnownRequestError("error", {
    code,
    clientVersion: "test",
  });

const toFormData = (entries: [string, string][]) => {
  const formData = new FormData();
  for (const [key, value] of entries) formData.append(key, value);
  return formData;
};

describe("parseForm", () => {
  const schema = z.object({ name: z.string().min(1, "必須です") });

  it("検証に成功したら変換後の値を返す", () => {
    const result = parseForm(schema, toFormData([["name", "田中"]]));
    expect(result).toEqual({ success: true, data: { name: "田中" } });
  });

  it("検証に失敗したらフィールドエラーと入力値を返す", () => {
    const result = parseForm(schema, toFormData([["name", ""]]));
    expect(result).toEqual({
      success: false,
      state: {
        message: "入力内容を確認してください",
        fieldErrors: { name: "必須です" },
        values: { name: "" },
      },
    });
  });

  it("同名キーが複数あれば配列として扱い、内部フィールドは除外する", () => {
    const result = parseForm(
      z.object({ tags: z.array(z.string()).max(1, "多すぎます") }),
      toFormData([
        ["$ACTION_ID_x", "1"],
        ["tags", "a"],
        ["tags", "b"],
      ]),
    );
    expect(result).toEqual({
      success: false,
      state: {
        message: "入力内容を確認してください",
        fieldErrors: { tags: "多すぎます" },
        values: { tags: ["a", "b"] },
      },
    });
  });
});

describe("toFailureState", () => {
  const formData = toFormData([["name", "x"]]);

  it("一意制約違反は指定フィールドのエラーにする", () => {
    expect(
      toFailureState(knownError("P2002"), formData, { uniqueField: "name" }),
    ).toMatchObject({ fieldErrors: { name: "既に登録されています" } });
  });

  it("対象フィールド未指定の一意制約違反はメッセージのみ返す", () => {
    expect(toFailureState(knownError("P2002"), formData)).toMatchObject({
      message: "既に登録されています",
    });
  });

  it("想定外のエラーは再 throw する", () => {
    const error = new Error("boom");
    expect(() => toFailureState(error, formData)).toThrow(error);
  });
});

describe("toDeleteFailureState", () => {
  it("外部キー違反は使用中のメッセージにする", () => {
    expect(toDeleteFailureState(knownError("P2003"))).toEqual({
      message: "他のデータで使用中のため削除できません",
    });
  });

  it("想定外のエラーは再 throw する", () => {
    const error = new Error("boom");
    expect(() => toDeleteFailureState(error)).toThrow(error);
  });
});
