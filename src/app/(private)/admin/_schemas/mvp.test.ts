import {
  MAX_MVPS,
  MVP_COMMENT_MAX,
  MVPS_ERROR_KEY,
  parseMvps,
} from "@/app/(private)/admin/_schemas/mvp";

/** 枠ごとの [選手, コメント] から、フォームの入力を作る */
const formOf = (slots: [string, string][]) => {
  const formData = new FormData();
  for (const [member, comment] of slots) {
    formData.append("mvpMember", member);
    formData.append("mvpComment", comment);
  }
  return formData;
};

describe("parseMvps", () => {
  it("使った枠の並びで、表示順を 1 から振る", () => {
    expect(
      parseMvps(
        formOf([
          ["5", " 決勝打 "],
          ["3", ""],
        ]),
      ),
    ).toEqual({
      success: true,
      entries: [
        { memberId: 5, order: 1, comment: "決勝打" },
        { memberId: 3, order: 2, comment: null },
      ],
    });
  });

  it("選手が空でコメントもない枠は、使わない枠として飛ばし、表示順に穴を作らない", () => {
    expect(
      parseMvps(
        formOf([
          ["", ""],
          ["3", ""],
        ]),
      ),
    ).toEqual({
      success: true,
      entries: [{ memberId: 3, order: 1, comment: null }],
    });
  });

  it("何も選ばれていなければ、MVP なしとして通す", () => {
    expect(parseMvps(formOf([["", ""]]))).toEqual({
      success: true,
      entries: [],
    });
    expect(parseMvps(new FormData())).toEqual({ success: true, entries: [] });
  });

  it("選手が空なのにコメントがあれば、その枠の選手欄にエラーを返す", () => {
    expect(parseMvps(formOf([["", "コメントだけ"]]))).toEqual({
      success: false,
      fieldErrors: { "mvpMember-0": "選手を選択してください" },
    });
  });

  it("同じ選手を複数の枠で選ぶと、後の枠にエラーを返す", () => {
    expect(
      parseMvps(
        formOf([
          ["3", ""],
          ["3", ""],
        ]),
      ),
    ).toEqual({
      success: false,
      fieldErrors: { "mvpMember-1": "同じ選手が複数回選ばれています" },
    });
  });

  it("コメントが上限を超えたら、その枠のコメント欄にエラーを返す", () => {
    expect(
      parseMvps(formOf([["3", "あ".repeat(MVP_COMMENT_MAX + 1)]])),
    ).toEqual({
      success: false,
      fieldErrors: {
        "mvpComment-0": `${MVP_COMMENT_MAX}文字以内で入力してください`,
      },
    });
  });

  it("枠が多すぎれば、全体のエラーを返す", () => {
    const slots = Array.from(
      { length: MAX_MVPS + 1 },
      (_, i): [string, string] => [String(i + 1), ""],
    );
    expect(parseMvps(formOf(slots))).toEqual({
      success: false,
      fieldErrors: { [MVPS_ERROR_KEY]: "MVP が多すぎます" },
    });
  });
});
