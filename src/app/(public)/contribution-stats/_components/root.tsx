import { PageTitle } from "@/app/_components/ui/page-title";
import { getContributionStats } from "@/app/_features/members/api/get-contribution-stats";
import { getSeasons } from "@/app/_features/seasons/api/get-seasons";
import { getCurrentSeason } from "@/app/_utils/date/date";
import { ContributionStatsView } from "@/app/(public)/contribution-stats/_components/contribution-stats-view";

/**
 * 貢献度（出席率・MVP 数）ページの本体。
 * 今シーズンの集計と選択可能な年度一覧をサーバーで取得し、
 * フィルタ・表示はクライアントコンポーネントに委譲する。
 */
export const Root = async () => {
  const season = getCurrentSeason();
  const [seasons, stats] = await Promise.all([
    getSeasons(),
    getContributionStats(season),
  ]);

  return (
    <>
      <PageTitle title="CONTRIBUTION STATS" subtitle="貢献度" />
      <main className="py-6 px-3 flex flex-col gap-y-6">
        <ContributionStatsView
          seasons={seasons}
          defaultSeason={season}
          initialStats={stats}
        />
      </main>
    </>
  );
};
