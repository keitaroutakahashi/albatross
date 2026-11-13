"use client";

import { useMemo, useState, useTransition } from "react";
import { fetchContributionStats } from "@/app/_actions/fetch-contribution-stats";
import { useNavigationProgressWhile } from "@/app/_components/ui/navigation-progress/use-navigation-progress-while";
import { StatsFilterBar } from "@/app/_components/ui/stats-filter-bar";
import { StatsRankingTable } from "@/app/_components/ui/stats-ranking-table";
import type { ContributionStatsResult } from "@/app/_features/members/api/get-contribution-stats";
import { rankMemberStats } from "@/app/_features/members/utils/ranking";
import { formatSeason } from "@/app/_utils/season";
import { formatAttendanceRate } from "@/app/_utils/stats/attendance";
import {
  CONTRIBUTION_CATEGORIES,
  type ContributionCategoryKey,
} from "@/app/(public)/contribution-stats/_components/categories";
import type { SeasonModel } from "@/generated/prisma/models/Season";
import { cn } from "@/lib/utils";

type Props = {
  seasons: SeasonModel[];
  defaultSeason: string;
  initialStats: ContributionStatsResult;
};

/**
 * `/contribution-stats` の年度・項目フィルタとランキング表示を担うクライアントコンポーネント。
 * クエリパラメータを使わないため、年度切替時のみ Server Action で再取得し、
 * 項目の切替はクライアント側で完結させる。
 */
export const ContributionStatsView = ({
  seasons,
  defaultSeason,
  initialStats,
}: Props) => {
  const [season, setSeason] = useState(defaultSeason);
  const [categoryKey, setCategoryKey] =
    useState<ContributionCategoryKey>("attendanceRate");
  const [stats, setStats] = useState(initialStats);
  const [isPending, startTransition] = useTransition();
  useNavigationProgressWhile(isPending);

  const category =
    CONTRIBUTION_CATEGORIES.find((c) => c.key === categoryKey) ??
    CONTRIBUTION_CATEGORIES[0];

  const handleSeasonChange = (nextSeason: string) => {
    setSeason(nextSeason);
    startTransition(async () => {
      setStats(await fetchContributionStats(nextSeason));
    });
  };

  const rankedRows = useMemo(() => {
    // MVP は 1 度も選ばれていない選手を載せない
    const rows = stats.rows.filter((row) => {
      const value = row[category.key];
      return (
        typeof value === "number" && (category.key !== "mvpCount" || value > 0)
      );
    });

    return rankMemberStats(rows, (row) => row[category.key] as number, "desc");
  }, [stats.rows, category]);

  return (
    <div className="flex flex-col gap-y-6">
      <StatsFilterBar
        seasons={seasons}
        season={season}
        onSeasonChange={handleSeasonChange}
        categories={CONTRIBUTION_CATEGORIES}
        categoryKey={categoryKey}
        onCategoryChange={(key) =>
          setCategoryKey(key as ContributionCategoryKey)
        }
        disabled={isPending}
      />

      <div>
        <div className="flex items-baseline justify-between border-b-2 border-primary pb-2">
          <h2 className="text-sm font-bold">{category.label}</h2>
          <p className="text-xs text-gray-500">
            {formatSeason(stats.season)} / 全{stats.eventCount}イベント
          </p>
        </div>

        <div className={cn("transition-opacity", { "opacity-50": isPending })}>
          <StatsRankingTable
            rows={rankedRows}
            valueLabel={category.label}
            formatValue={(value) =>
              category.key === "attendanceRate"
                ? formatAttendanceRate(value)
                : String(value)
            }
          />
        </div>
      </div>
    </div>
  );
};
