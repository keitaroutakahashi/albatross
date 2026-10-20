import { fetchBattingStats } from "@/app/_actions/fetch-batting-stats";
import { fetchPitchingStats } from "@/app/_actions/fetch-pitching-stats";
import { getBattingStats } from "@/app/_features/members/api/get-batting-stats";
import { getPitchingStats } from "@/app/_features/members/api/get-pitching-stats";

vi.mock("@/app/_features/members/api/get-batting-stats", () => ({
  getBattingStats: vi.fn(),
}));
vi.mock("@/app/_features/members/api/get-pitching-stats", () => ({
  getPitchingStats: vi.fn(),
}));

describe.each([
  {
    name: "fetchBattingStats",
    action: fetchBattingStats,
    api: getBattingStats,
  },
  {
    name: "fetchPitchingStats",
    action: fetchPitchingStats,
    api: getPitchingStats,
  },
])("$name", ({ action, api }) => {
  it("年度とリーグ ID をそのまま渡す", async () => {
    await action("2026", 3);
    expect(api).toHaveBeenCalledWith("2026", 3);
  });

  it("リーグを指定しなければ、絞り込まない", async () => {
    await action("2026");
    expect(api).toHaveBeenCalledWith("2026", undefined);
  });

  it("公開エンドポイントのため、整数でないリーグ ID は無視する", async () => {
    for (const bad of [1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
      vi.mocked(api).mockClear();
      await action("2026", bad);
      expect(api).toHaveBeenCalledWith("2026", undefined);
    }
  });
});
