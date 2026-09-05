import { PageTitle } from "@/app/_components/ui/page-title";
import { getBattingStats } from "@/app/_features/members/api/get-batting-stats";
import { getSeasons } from "@/app/_features/seasons/api/get-seasons";
import { getCurrentSeason } from "@/app/_utils/date/date";
import { BattingStatsView } from "@/app/(public)/batting-stats/_components/batting-stats-view";

/**
 * 打者成績一覧ページの本体。
 * 今シーズンの打撃成績と選択可能な年度一覧をサーバーで取得し、
 * フィルタ・表示はクライアントコンポーネントに委譲する。
 */
export const Root = async () => {
  const season = getCurrentSeason();
  const [seasons, stats] = await Promise.all([
    getSeasons(),
    getBattingStats(season),
  ]);

  return (
    <>
      <PageTitle title="BATTING STATS" subtitle="打者成績" />
      <main className="py-6 px-3 flex flex-col gap-y-6">
        <BattingStatsView
          seasons={seasons}
          defaultSeason={season}
          initialStats={stats}
        />
      </main>
    </>
  );
};
