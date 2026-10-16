import { resolvePitchingDecision } from "@/app/_utils/stats/pitching-decision";

describe("resolvePitchingDecision", () => {
  it("責任投手は、勝った試合なら勝ち、負けた試合なら負けになる", () => {
    expect(resolvePitchingDecision(true, "win")).toBe("win");
    expect(resolvePitchingDecision(true, "lose")).toBe("loss");
  });

  it("引き分け・結果が未確定の試合では勝敗がつかない", () => {
    expect(resolvePitchingDecision(true, "draw")).toBeNull();
    expect(resolvePitchingDecision(true, null)).toBeNull();
  });

  it("責任投手でなければ勝敗がつかない", () => {
    expect(resolvePitchingDecision(false, "win")).toBeNull();
    expect(resolvePitchingDecision(false, "lose")).toBeNull();
  });
});
