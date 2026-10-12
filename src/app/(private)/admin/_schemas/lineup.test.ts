import { parseLineup } from "@/app/(private)/admin/_schemas/lineup";

const toFormData = (entries: Record<string, string>) => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    formData.append(key, value);
  }
  return formData;
};

describe("parseLineup", () => {
  it("出場なしのメンバーは結果に含めない", () => {
    const result = parseLineup(
      toFormData({ "memberType-1": "", "memberType-2": "" }),
      [1, 2],
    );
    expect(result).toEqual({ success: true, entries: [] });
  });

  it("スタメンは打順・守備位置を数値・列挙値に変換する", () => {
    const result = parseLineup(
      toFormData({
        "memberType-1": "starting",
        "battingOrder-1": "4",
        "position-1": "catcher",
        "stolenBases-1": "2",
      }),
      [1],
    );
    expect(result).toEqual({
      success: true,
      entries: [
        {
          memberId: 1,
          memberType: "starting",
          battingOrder: 4,
          position: "catcher",
          stolenBases: 2,
        },
      ],
    });
  });

  it("ベンチは打順・守備位置を無視して null にし、盗塁は未入力なら 0 にする", () => {
    const result = parseLineup(
      toFormData({
        "memberType-1": "bench",
        "battingOrder-1": "9",
        "position-1": "first",
      }),
      [1],
    );
    expect(result).toEqual({
      success: true,
      entries: [
        {
          memberId: 1,
          memberType: "bench",
          battingOrder: null,
          position: null,
          stolenBases: 0,
        },
      ],
    });
  });

  it("スタメンの打順・守備位置が未入力ならエラーにする", () => {
    const result = parseLineup(toFormData({ "memberType-1": "starting" }), [1]);
    expect(result).toEqual({
      success: false,
      fieldErrors: {
        "battingOrder-1": "打順を入力してください",
        "position-1": "守備位置を選択してください",
      },
    });
  });

  it("スタメン内で打順が重複するとエラーにする", () => {
    const result = parseLineup(
      toFormData({
        "memberType-1": "starting",
        "battingOrder-1": "1",
        "position-1": "pitcher",
        "memberType-2": "starting",
        "battingOrder-2": "1",
        "position-2": "catcher",
      }),
      [1, 2],
    );
    expect(result).toEqual({
      success: false,
      fieldErrors: { "battingOrder-2": "打順が重複しています" },
    });
  });

  it("打順が範囲外ならエラーにする", () => {
    const result = parseLineup(
      toFormData({
        "memberType-1": "starting",
        "battingOrder-1": "21",
        "position-1": "pitcher",
      }),
      [1],
    );
    expect(result.success).toBe(false);
  });
});
