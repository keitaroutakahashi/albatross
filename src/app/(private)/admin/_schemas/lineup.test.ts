import { parseLineup } from "@/app/(private)/admin/_schemas/lineup";

/** 同名の入力欄が複数ある FormData を作る */
const toFormData = (fields: Record<string, string[]>) => {
  const formData = new FormData();
  for (const [name, values] of Object.entries(fields)) {
    for (const value of values) formData.append(name, value);
  }
  return formData;
};

const NINE_POSITIONS = [
  "pitcher",
  "catcher",
  "first",
  "second",
  "third",
  "shortstop",
  "left",
  "center",
  "right",
];

/** 選手 ID 1〜9 が、守備位置を 1 人ずつ守る 9 人のスタメン */
const nineStarters = () => ({
  starterMember: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
  starterPosition: [...NINE_POSITIONS],
});

describe("parseLineup", () => {
  it("何も選ばなければ、登録なしとして通る", () => {
    const result = parseLineup(
      toFormData({
        starterMember: ["", ""],
        starterPosition: ["", ""],
        benchMember: [""],
      }),
    );
    expect(result).toEqual({ success: true, entries: [] });
  });

  it("行の位置を打順にして、スタメンとベンチを分ける", () => {
    const result = parseLineup(
      toFormData({ ...nineStarters(), benchMember: ["10", ""] }),
    );
    expect(result).toMatchObject({ success: true });
    if (!result.success) return;
    expect(result.entries).toHaveLength(10);
    expect(result.entries[0]).toEqual({
      memberId: 1,
      memberType: "starting",
      battingOrder: 1,
      position: "pitcher",
    });
    expect(result.entries[8]).toEqual({
      memberId: 9,
      memberType: "starting",
      battingOrder: 9,
      position: "right",
    });
    expect(result.entries[9]).toEqual({
      memberId: 10,
      memberType: "bench",
      battingOrder: null,
      position: null,
    });
  });

  it("DH は何人いてもよく、打順は行の位置で決まる（空き行があっても詰めない）", () => {
    const result = parseLineup(
      toFormData({
        starterMember: [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "",
          "11",
        ],
        starterPosition: [...NINE_POSITIONS, "dh", "", "dh"],
      }),
    );
    expect(result).toMatchObject({ success: true });
    if (!result.success) return;
    expect(result.entries.map((e) => e.battingOrder)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12,
    ]);
  });

  it("スタメンが 9 人未満ならエラーにする", () => {
    const result = parseLineup(
      toFormData({
        starterMember: ["1", "2", "3"],
        starterPosition: ["pitcher", "catcher", "first"],
      }),
    );
    expect(result).toEqual({
      success: false,
      fieldErrors: { starters: "スタメンは9人以上にしてください" },
    });
  });

  it("ベンチだけ選んでスタメンがいない場合もエラーにする", () => {
    const result = parseLineup(toFormData({ benchMember: ["10"] }));
    expect(result).toEqual({
      success: false,
      fieldErrors: { starters: "スタメンは9人以上にしてください" },
    });
  });

  it("9 人でも、DH を含めて守備位置が足りなければ不足を伝える", () => {
    const starters = nineStarters();
    // 遊撃手の代わりに DH
    starters.starterPosition[5] = "dh";
    const result = parseLineup(toFormData(starters));
    expect(result).toEqual({
      success: false,
      fieldErrors: { starters: "守備位置が足りません（遊）" },
    });
  });

  it("DH 以外の守備位置が重複したら、後の行をエラーにする", () => {
    const starters = nineStarters();
    starters.starterPosition[1] = "pitcher";
    const result = parseLineup(toFormData(starters));
    expect(result).toEqual({
      success: false,
      fieldErrors: { "starterPosition-1": "守備位置が重複しています" },
    });
  });

  it("選手だけ・守備位置だけの行はエラーにする", () => {
    const result = parseLineup(
      toFormData({
        starterMember: ["8", ""],
        starterPosition: ["", "catcher"],
      }),
    );
    expect(result).toEqual({
      success: false,
      fieldErrors: {
        "starterPosition-0": "守備位置を選択してください",
        "starterMember-1": "選手を選択してください",
      },
    });
  });

  it("同じ選手を複数回選ぶと、後の行をエラーにする（スタメン・ベンチをまたいでも）", () => {
    const starters = nineStarters();
    const result = parseLineup(toFormData({ ...starters, benchMember: ["1"] }));
    expect(result).toEqual({
      success: false,
      fieldErrors: { "benchMember-0": "同じ選手が複数回選ばれています" },
    });
  });

  it("不正な選手 ID・守備位置はエラーにする", () => {
    const result = parseLineup(
      toFormData({
        starterMember: ["abc"],
        starterPosition: ["goalkeeper"],
      }),
    );
    expect(result).toEqual({
      success: false,
      fieldErrors: {
        "starterMember-0": "選手を選択してください",
        "starterPosition-0": "守備位置を選択してください",
      },
    });
  });

  it("打順が上限を超えるとエラーにする", () => {
    const result = parseLineup(
      toFormData({
        starterMember: Array.from({ length: 21 }, () => ""),
        starterPosition: Array.from({ length: 21 }, () => ""),
      }),
    );
    expect(result.success).toBe(false);
  });
});
