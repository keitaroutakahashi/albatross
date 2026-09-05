import { formatRate } from "@/app/_utils/stats/rate";

describe("formatRate", () => {
  it("1未満の値は先頭の 0 を落として表示する", () => {
    expect(formatRate(0.317)).toBe(".317");
  });

  it("1以上の値は先頭の 0 を落とさずに表示する", () => {
    expect(formatRate(1.023)).toBe("1.023");
  });

  it("0 は '.000' と表示する", () => {
    expect(formatRate(0)).toBe(".000");
  });

  it("null のときは既定の fallback ('-') を返す", () => {
    expect(formatRate(null)).toBe("-");
  });

  it("fallback を指定した場合はその文字列を返す", () => {
    expect(formatRate(null, "記録なし")).toBe("記録なし");
  });
});
