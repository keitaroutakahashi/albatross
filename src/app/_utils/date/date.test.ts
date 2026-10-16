import {
  formatJstDateTimeWithDay,
  getJstDayRange,
  getMonthInJst,
  isOnOrAfterJstDay,
  parseJstDateTimeLocal,
  toJstDateTimeLocal,
} from "@/app/_utils/date/date";

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

describe("JST の datetime-local 変換", () => {
  it("日付をまたぐ UTC の時刻も日本時間の値に変換する", () => {
    // 2025-04-01 00:30 JST
    expect(toJstDateTimeLocal(new Date("2025-03-31T15:30:00Z"))).toBe(
      "2025-04-01T00:30",
    );
  });

  it("datetime-local の値を日本時間として解釈する", () => {
    expect(parseJstDateTimeLocal("2026-10-25T09:00").toISOString()).toBe(
      "2026-10-25T00:00:00.000Z",
    );
  });

  it("変換は往復しても同じ値になる", () => {
    expect(toJstDateTimeLocal(parseJstDateTimeLocal("2026-01-01T00:00"))).toBe(
      "2026-01-01T00:00",
    );
  });

  it("曜日付きで表示用にフォーマットする", () => {
    expect(formatJstDateTimeWithDay(new Date("2026-10-25T00:00:00Z"))).toBe(
      "2026/10/25(日) 09:00",
    );
  });

  it("日本時間で同じ日の範囲を返す", () => {
    // 2025-04-01 00:30 JST → 2025-04-01 00:00 〜 2025-04-02 00:00 JST
    const { start, end } = getJstDayRange(new Date("2025-03-31T15:30:00Z"));
    expect(start.toISOString()).toBe("2025-03-31T15:00:00.000Z");
    expect(end.toISOString()).toBe("2025-04-01T15:00:00.000Z");
  });
});

describe("isOnOrAfterJstDay", () => {
  // 2026-10-26 17:47 JST
  const date = new Date("2026-10-26T08:47:00Z");

  it("同じ日なら、時刻が前でも true（当日を含む）", () => {
    // 2026-10-26 08:00 JST
    expect(isOnOrAfterJstDay(new Date("2026-10-25T23:00:00Z"), date)).toBe(
      true,
    );
  });

  it("翌日以降は true", () => {
    expect(isOnOrAfterJstDay(new Date("2026-10-27T00:00:00Z"), date)).toBe(
      true,
    );
  });

  it("前日は false", () => {
    // 2026-10-25 23:59 JST
    expect(isOnOrAfterJstDay(new Date("2026-10-25T14:59:00Z"), date)).toBe(
      false,
    );
  });

  it("UTC では前日でも、日本時間で当日なら true", () => {
    // 2026-10-26 00:30 JST
    expect(isOnOrAfterJstDay(new Date("2026-10-25T15:30:00Z"), date)).toBe(
      true,
    );
  });
});
