import { formatSeason } from "@/app/_utils/season";

describe("formatSeason", () => {
  it("年度に「年度シーズン」を付けて返す", () => {
    expect(formatSeason(2026)).toBe("2026年度シーズン");
    expect(formatSeason("2025")).toBe("2025年度シーズン");
  });
});
