import { render, screen } from "@testing-library/react";
import { StatsFilterBar } from "@/app/_components/ui/stats-filter-bar";
import { ALL_LEAGUES } from "@/app/_features/leagues/utils/league-filter";
import type { LeagueModel } from "@/generated/prisma/models/League";
import type { SeasonModel } from "@/generated/prisma/models/Season";

const seasons = [{ id: 1, season: 2026 }] as SeasonModel[];
const leagues = [{ id: 1, name: "スカイツリーグ" }] as LeagueModel[];

const renderBar = (leagueList: LeagueModel[]) =>
  render(
    <StatsFilterBar
      seasons={seasons}
      season="2026"
      onSeasonChange={vi.fn()}
      leagues={leagueList}
      league={ALL_LEAGUES}
      onLeagueChange={vi.fn()}
      categories={[{ key: "average", label: "打率" }]}
      categoryKey="average"
      onCategoryChange={vi.fn()}
      qualifiedOnly
      onQualifiedChange={vi.fn()}
      qualifiedLabel="規定打席"
    />,
  );

describe("StatsFilterBar のリーグ", () => {
  it("リーグがあれば、年度・リーグ・項目の 3 つのセレクトを出す", () => {
    renderBar(leagues);
    expect(screen.getAllByRole("combobox")).toHaveLength(3);
    expect(screen.getByRole("combobox", { name: "リーグ" })).toHaveTextContent(
      "すべてのリーグ",
    );
  });

  it("リーグが登録されていなければ、リーグのセレクトを出さない", () => {
    renderBar([]);
    expect(screen.getAllByRole("combobox")).toHaveLength(2);
    expect(
      screen.queryByRole("combobox", { name: "リーグ" }),
    ).not.toBeInTheDocument();
  });
});
