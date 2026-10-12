import { getMonthInJst } from "@/app/_utils/date/date";

describe("getMonthInJst", () => {
  it("UTC では前月でも日本時間で翌月になる時刻は翌月を返す", () => {
    // 2025-04-01 00:30 JST
    expect(getMonthInJst(new Date("2025-03-31T15:30:00Z"))).toBe(4);
  });

  it("日本時間でも月内の時刻はその月を返す", () => {
    // 2025-03-31 23:30 JST
    expect(getMonthInJst(new Date("2025-03-31T14:30:00Z"))).toBe(3);
  });
});
