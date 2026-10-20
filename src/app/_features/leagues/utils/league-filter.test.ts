import {
  ALL_LEAGUES,
  toLeagueId,
} from "@/app/_features/leagues/utils/league-filter";

describe("toLeagueId", () => {
  it("リーグの ID を数値に変換する", () => {
    expect(toLeagueId("3")).toBe(3);
  });

  it("「すべてのリーグ」は絞り込まない（undefined）", () => {
    expect(toLeagueId(ALL_LEAGUES)).toBeUndefined();
  });

  it("不正な値は絞り込まない（undefined）", () => {
    for (const value of ["", "abc", "1.5", "0", "-1"]) {
      expect(toLeagueId(value)).toBeUndefined();
    }
  });
});
