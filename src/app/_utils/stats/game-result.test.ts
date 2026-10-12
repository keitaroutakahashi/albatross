import { calcGameResult } from "@/app/_utils/stats/game-result";

describe("calcGameResult", () => {
  it("自チームが多ければ勝ち", () => {
    expect(calcGameResult(3, 1)).toBe("win");
  });

  it("相手が多ければ負け", () => {
    expect(calcGameResult(0, 2)).toBe("lose");
  });

  it("同点なら引き分け（0-0 を含む）", () => {
    expect(calcGameResult(2, 2)).toBe("draw");
    expect(calcGameResult(0, 0)).toBe("draw");
  });

  it("どちらかが未入力なら null", () => {
    expect(calcGameResult(null, 1)).toBeNull();
    expect(calcGameResult(1, null)).toBeNull();
  });
});
