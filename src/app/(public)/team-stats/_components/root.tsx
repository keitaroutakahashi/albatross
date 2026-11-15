import { PageTitle } from "@/app/_components/ui/page-title";
import { getSeasons } from "@/app/_features/seasons/api/get-seasons";
import { getTeamStats } from "@/app/_features/team/api/get-team-stats";
import { getCurrentSeason } from "@/app/_utils/date/date";
import { TeamStatsView } from "@/app/(public)/team-stats/_components/team-stats-view";

/**
 * チーム成績ページの本体。
 * 今シーズンの成績と選択可能な年度の一覧をサーバーで取得し、
 * 年度の切り替えとタブの表示はクライアントコンポーネントに委譲する。
 */
export const Root = async () => {
  const season = getCurrentSeason();
  const [seasons, stats] = await Promise.all([
    getSeasons(),
    getTeamStats(season),
  ]);

  return (
    <>
      <PageTitle title="TEAM STATS" subtitle="チーム成績" />
      <main className="py-6 px-3 flex flex-col gap-y-6">
        <TeamStatsView
          seasons={seasons}
          defaultSeason={season}
          initialStats={stats}
        />
      </main>
    </>
  );
};
