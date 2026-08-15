import { PageTitle } from "@/app/_components/ui/page-title";
import { getPitchingStats } from "@/app/_features/members/api/get-pitching-stats";
import { getSeasons } from "@/app/_features/seasons/api/get-seasons";
import { getCurrentSeason } from "@/app/_utils/date/date";
import { PitchingStatsView } from "@/app/(public)/pitching-stats/_components/pitching-stats-view";

/**
 * 投手成績一覧ページの本体。
 * 今シーズンの投球成績と選択可能な年度一覧をサーバーで取得し、
 * フィルタ・表示はクライアントコンポーネントに委譲する。
 */
export const Root = async () => {
  const season = getCurrentSeason();
  const [seasons, stats] = await Promise.all([
    getSeasons(),
    getPitchingStats(season),
  ]);

  return (
    <>
      <PageTitle title="PITCHING STATS" subtitle="投手成績" />
      <main className="py-6 px-3 flex flex-col gap-y-6">
        <PitchingStatsView
          seasons={seasons}
          defaultSeason={season}
          initialStats={stats}
        />
      </main>
    </>
  );
};
