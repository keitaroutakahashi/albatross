import {
  countHits,
  countOpponentErrors,
  sumHitsAllowed,
} from "@/app/_utils/stats/game-totals";

describe("countHits", () => {
  it("単打・二塁打・三塁打・本塁打だけを安打として数える", () => {
    expect(
      countHits([
        "single",
        "double",
        "triple",
        "homeRun",
        "walk",
        "strikeout",
        "groundOut",
        "error",
        "fieldersChoice",
        "sacrificeHit",
      ]),
    ).toBe(4);
  });

  it("打席がなければ 0", () => {
    expect(countHits([])).toBe(0);
  });
});

describe("countOpponentErrors", () => {
  it("エラー出塁だけを相手の失策として数える", () => {
    expect(
      countOpponentErrors(["error", "single", "error", "fieldersChoice"]),
    ).toBe(2);
  });
});

describe("sumHitsAllowed", () => {
  it("投手ごとの被安打を合計する", () => {
    expect(sumHitsAllowed([3, 0, 2])).toBe(5);
    expect(sumHitsAllowed([])).toBe(0);
  });
});
