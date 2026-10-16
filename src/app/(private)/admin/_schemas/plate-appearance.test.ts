import { parseAtBats } from "@/app/(private)/admin/_schemas/plate-appearance";

/** 同名の入力欄が複数ある FormData を作る */
const toFormData = (fields: Record<string, string[]>) => {
  const formData = new FormData();
  for (const [name, values] of Object.entries(fields)) {
    for (const value of values) formData.append(name, value);
  }
  return formData;
};

/** 3 行分の空の入力 */
const blankRows = () => ({
  inningNumber: ["", "", ""],
  result: ["", "", ""],
  direction: ["", "", ""],
  rbi: ["0", "0", "0"],
});

describe("parseAtBats", () => {
  it("何も入力されていなければ、登録なしとして通る", () => {
    expect(parseAtBats(toFormData(blankRows()))).toEqual({
      success: true,
      entries: [],
    });
  });

  it("行の位置を打席番号にして、数値・列挙値に変換する", () => {
    const rows = blankRows();
    rows.inningNumber = ["1", "", "5"];
    rows.result = ["single", "", "strikeout"];
    rows.direction = ["left", "", ""];
    rows.rbi = ["2", "0", "0"];
    const result = parseAtBats(
      toFormData({ ...rows, isScoringPosition: ["1"] }),
    );
    expect(result).toEqual({
      success: true,
      entries: [
        {
          atBatInGame: 1,
          inningNumber: 1,
          result: "single",
          direction: "left",
          rbi: 2,
          isScoringPosition: true,
        },
        {
          atBatInGame: 3,
          inningNumber: 5,
          result: "strikeout",
          direction: null,
          rbi: 0,
          isScoringPosition: false,
        },
      ],
    });
  });

  it("三振・四死球は打球方向が送られても保存しない", () => {
    const rows = blankRows();
    rows.inningNumber = ["1", "2", "3"];
    rows.result = ["strikeout", "walk", "hitByPitch"];
    rows.direction = ["left", "center", "right"];
    const result = parseAtBats(toFormData(rows));
    expect(result).toMatchObject({ success: true });
    if (!result.success) return;
    expect(result.entries.map((e) => e.direction)).toEqual([null, null, null]);
  });

  it("エラー出塁・併殺打・三振は、打点が送られても 0 として保存する", () => {
    const rows = blankRows();
    rows.inningNumber = ["1", "2", "3"];
    rows.result = ["error", "doublePlay", "strikeout"];
    rows.direction = ["shortstop", "second", ""];
    rows.rbi = ["1", "2", "9"];
    const result = parseAtBats(toFormData(rows));
    expect(result).toMatchObject({ success: true });
    if (!result.success) return;
    expect(result.entries.map((e) => e.rbi)).toEqual([0, 0, 0]);
  });

  it("打点がつく結果（安打・四死球・犠打など）は打点を保存する", () => {
    const rows = blankRows();
    rows.inningNumber = ["1", "2", "3"];
    rows.result = ["single", "walk", "sacrificeFly"];
    rows.direction = ["left", "", "center"];
    rows.rbi = ["1", "1", "1"];
    const result = parseAtBats(toFormData(rows));
    expect(result).toMatchObject({ success: true });
    if (!result.success) return;
    expect(result.entries.map((e) => e.rbi)).toEqual([1, 1, 1]);
  });

  it("打球方向が必要な結果で未選択ならエラーにする（三振・四死球は不要）", () => {
    const rows = blankRows();
    rows.inningNumber = ["1", "2", "3"];
    rows.result = ["single", "strikeout", "error"];
    expect(parseAtBats(toFormData(rows))).toEqual({
      success: false,
      fieldErrors: {
        "direction-0": "打球方向を選択してください",
        "direction-2": "打球方向を選択してください",
      },
    });
  });

  it("打球方向のある結果（犠打・エラーなど）は打球方向を保存する", () => {
    const rows = blankRows();
    rows.inningNumber = ["1", "2", "3"];
    rows.result = ["sacrificeHit", "error", "groundOut"];
    rows.direction = ["pitcher", "shortstop", "second"];
    const result = parseAtBats(toFormData(rows));
    expect(result).toMatchObject({ success: true });
    if (!result.success) return;
    expect(result.entries.map((e) => e.direction)).toEqual([
      "pitcher",
      "shortstop",
      "second",
    ]);
  });

  it("打点が未入力なら 0 として扱う", () => {
    const rows = blankRows();
    rows.inningNumber[0] = "1";
    rows.result[0] = "walk";
    rows.rbi[0] = "";
    const result = parseAtBats(toFormData(rows));
    expect(result).toMatchObject({
      success: true,
      entries: [{ atBatInGame: 1, rbi: 0 }],
    });
  });

  it("結果だけ・イニングだけの行はエラーにする", () => {
    const rows = blankRows();
    rows.result[0] = "single";
    rows.inningNumber[1] = "2";
    expect(parseAtBats(toFormData(rows))).toEqual({
      success: false,
      fieldErrors: {
        "inningNumber-0": "必須です",
        "result-1": "選択してください",
      },
    });
  });

  it("打球方向や得点圏だけが入力された行も、結果の選択を求める", () => {
    const rows = blankRows();
    rows.direction[0] = "left";
    const result = parseAtBats(
      toFormData({ ...rows, isScoringPosition: ["2"] }),
    );
    expect(result).toMatchObject({
      success: false,
      fieldErrors: {
        "inningNumber-0": "必須です",
        "result-0": "選択してください",
        "inningNumber-1": "必須です",
        "result-1": "選択してください",
      },
    });
  });

  it("範囲外のイニング・打点、不正な結果はエラーにする", () => {
    const rows = blankRows();
    rows.inningNumber = ["31", "1", "1"];
    rows.result = ["single", "homerun", "single"];
    rows.rbi = ["0", "0", "5"];
    expect(parseAtBats(toFormData(rows))).toEqual({
      success: false,
      fieldErrors: {
        "inningNumber-0": "30以下で入力してください",
        "result-1": "選択してください",
        "rbi-2": "4以下で入力してください",
      },
    });
  });

  it("打席が上限を超えるとエラーにする", () => {
    const result = parseAtBats(
      toFormData({
        inningNumber: Array.from({ length: 21 }, () => ""),
        result: Array.from({ length: 21 }, () => ""),
        direction: Array.from({ length: 21 }, () => ""),
        rbi: Array.from({ length: 21 }, () => "0"),
      }),
    );
    expect(result.success).toBe(false);
  });
});
