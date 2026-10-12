import { groundSchema } from "@/app/(private)/admin/_schemas/ground";
import { memberSchema } from "@/app/(private)/admin/_schemas/member";
import { seasonSchema } from "@/app/(private)/admin/_schemas/season";
import { userSchema } from "@/app/(private)/admin/_schemas/user";

type Issues = { path: PropertyKey[]; message: string }[];

/** フィールド名 → エラーメッセージの形に整える */
const errorsOf = (result: { success: boolean; error?: { issues: Issues } }) =>
  Object.fromEntries(
    result.error?.issues.map((i) => [i.path[0], i.message]) ?? [],
  );

describe("seasonSchema", () => {
  it("年度を数値に変換し、未入力の名称は null にする", () => {
    expect(seasonSchema.parse({ season: "2026", name: "" })).toEqual({
      season: 2026,
      name: null,
    });
  });

  it("未入力の年度は 0 ではなく必須エラーにする", () => {
    expect(errorsOf(seasonSchema.safeParse({ season: "", name: "" }))).toEqual({
      season: "必須です",
    });
  });

  it("数値以外・小数・範囲外はエラーにする", () => {
    expect(seasonSchema.safeParse({ season: "abc", name: "" }).success).toBe(
      false,
    );
    expect(seasonSchema.safeParse({ season: "2026.5", name: "" }).success).toBe(
      false,
    );
    expect(seasonSchema.safeParse({ season: "1999", name: "" }).success).toBe(
      false,
    );
  });
});

describe("groundSchema", () => {
  const valid = {
    name: "代々木",
    address: "東京都",
    access: "",
    url: "https://example.com",
    imagePath: "",
  };

  it("任意項目の空文字は null にする", () => {
    expect(groundSchema.parse(valid)).toMatchObject({
      access: null,
      imagePath: null,
    });
  });

  it("URL 形式でなければエラーにする", () => {
    expect(errorsOf(groundSchema.safeParse({ ...valid, url: "foo" }))).toEqual({
      url: "URL の形式で入力してください",
    });
  });
});

describe("userSchema", () => {
  const valid = { email: "taro@example.com", name: "", role: "operator" };

  it("メールアドレス形式でなければエラーにする", () => {
    expect(errorsOf(userSchema.safeParse({ ...valid, email: "foo" }))).toEqual({
      email: "メールアドレスの形式で入力してください",
    });
  });

  it("権限は管理者・運営のみ許可する", () => {
    expect(userSchema.parse({ ...valid, role: "admin" })).toMatchObject({
      role: "admin",
    });
    expect(errorsOf(userSchema.safeParse({ ...valid, role: "owner" }))).toEqual(
      {
        role: "選択してください",
      },
    );
    expect(errorsOf(userSchema.safeParse({ email: valid.email }))).toEqual({
      role: "選択してください",
    });
  });
});

describe("memberSchema", () => {
  const valid = {
    name: "田中太郎",
    uniformNumber: "1",
    position: "pitcher",
    throwHand: "right",
    batHand: "right",
    category: "regular",
  };

  it("未チェックの isActive は false、未選択の subPositions は空配列にする", () => {
    expect(memberSchema.parse(valid)).toMatchObject({
      isActive: false,
      subPositions: [],
    });
  });

  it("subPositions は 1 件だけ（文字列）でも配列にする", () => {
    expect(
      memberSchema.parse({ ...valid, subPositions: "first", isActive: "on" }),
    ).toMatchObject({ subPositions: ["first"], isActive: true });
  });

  it("メインポジションと重複するサブポジションはエラーにする", () => {
    expect(
      errorsOf(memberSchema.safeParse({ ...valid, subPositions: ["pitcher"] })),
    ).toEqual({ subPositions: "メインポジションと重複しています" });
  });

  it("不正な列挙値はエラーにする", () => {
    expect(
      errorsOf(memberSchema.safeParse({ ...valid, position: "unknown" })),
    ).toEqual({ position: "選択してください" });
  });
});
