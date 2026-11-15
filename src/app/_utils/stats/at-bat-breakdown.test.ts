import {
  summarizeAtBatResults,
  summarizeOutResults,
} from "@/app/_utils/stats/at-bat-breakdown";

describe("summarizeAtBatResults", () => {
  it("結果ごとの回数と割合を、出現した結果だけ返す", () => {
    const rows = summarizeAtBatResults([
      "single",
      "strikeout",
      "strikeout",
      "groundOut",
    ]);

    expect(rows.map((r) => r.result)).toEqual([
      "single",
      "strikeout",
      "groundOut",
    ]);
    expect(rows.find((r) => r.result === "strikeout")).toEqual({
      result: "strikeout",
      count: 2,
      rate: 0.5,
    });
  });

  it("打席がないときは空になる", () => {
    expect(summarizeAtBatResults([])).toEqual([]);
  });
});

describe("summarizeOutResults", () => {
  it("アウトになった打席だけを対象に、アウト全体に占める割合を求める", () => {
    const rows = summarizeOutResults([
      "single",
      "walk",
      "fieldersChoice",
      "strikeout",
      "groundOut",
      "groundOut",
      "sacrificeFly",
    ]);

    expect(rows.map((r) => [r.result, r.count])).toEqual([
      ["strikeout", 1],
      ["groundOut", 2],
      ["sacrificeFly", 1],
    ]);
    expect(rows.find((r) => r.result === "groundOut")?.rate).toBe(0.5);
  });

  it("アウトがないときは空になる", () => {
    expect(summarizeOutResults(["single", "walk"])).toEqual([]);
  });
});
