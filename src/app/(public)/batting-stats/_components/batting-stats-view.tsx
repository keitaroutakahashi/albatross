"use client";

import { useMemo, useState, useTransition } from "react";
import { fetchBattingStats } from "@/app/_actions/fetch-batting-stats";
import { StatsFilterBar } from "@/app/_components/ui/stats-filter-bar";
import { StatsRankingTable } from "@/app/_components/ui/stats-ranking-table";
import type { BattingStatsResult } from "@/app/_features/members/api/get-batting-stats";
import { rankMemberStats } from "@/app/_features/members/utils/ranking";
import { formatRate } from "@/app/_utils/stats/rate";
import { BATTING_CATEGORIES } from "@/app/(public)/batting-stats/_components/categories";
import type { SeasonModel } from "@/generated/prisma/models/Season";

type Props = {
  seasons: SeasonModel[];
  defaultSeason: string;
  initialStats: BattingStatsResult;
};

/**
 * `/batting-stats` の年度・指標フィルタとランキング表示を担うクライアントコンポーネント。
 * クエリパラメータを使わないため、年度切替時のみ Server Action で再取得し、
 * 指標切替・規定打席フィルタはクライアント側で完結させる。
 */
export const BattingStatsView = ({
  seasons,
  defaultSeason,
  initialStats,
}: Props) => {
  const [season, setSeason] = useState(defaultSeason);
  const [categoryKey, setCategoryKey] =
    useState<(typeof BATTING_CATEGORIES)[number]["key"]>("average");
  const [qualifiedOnly, setQualifiedOnly] = useState(true);
  const [stats, setStats] = useState(initialStats);
  const [isPending, startTransition] = useTransition();

  const category =
    BATTING_CATEGORIES.find((c) => c.key === categoryKey) ??
    BATTING_CATEGORIES[0];

  const handleSeasonChange = (nextSeason: string) => {
    setSeason(nextSeason);
    startTransition(async () => {
      const nextStats = await fetchBattingStats(nextSeason);
      setStats(nextStats);
    });
  };

  const rankedRows = useMemo(() => {
    const rows = stats.rows.filter((row) => {
      const value = row[category.key];
      if (typeof value !== "number") return false;
      if (category.isRate && qualifiedOnly && !row.isQualified) return false;
      return true;
    });

    return rankMemberStats(rows, (row) => row[category.key] as number, "desc");
  }, [stats.rows, category, qualifiedOnly]);

  return (
    <div className="flex flex-col gap-y-6">
      <StatsFilterBar
        seasons={seasons}
        season={season}
        onSeasonChange={handleSeasonChange}
        categories={BATTING_CATEGORIES}
        categoryKey={categoryKey}
        onCategoryChange={(key) =>
          setCategoryKey(key as (typeof BATTING_CATEGORIES)[number]["key"])
        }
        qualifiedOnly={qualifiedOnly}
        onQualifiedChange={setQualifiedOnly}
        qualifiedLabel="規定打席"
        qualifiedHint="規定打席: 10 打席以上、またはシーズンの試合数以上の打席に立っていること"
        qualifiedDisabled={!category.isRate}
        disabled={isPending}
      />

      <div>
        <div className="flex items-baseline justify-between border-b-2 border-primary pb-2">
          <h2 className="text-sm font-bold">{category.label}</h2>
          <p className="text-xs text-gray-500">
            {stats.season} シーズン / 公式戦 全{stats.gameCount}試合
          </p>
        </div>

        <div className={`transition-opacity${isPending ? " opacity-50" : ""}`}>
          <StatsRankingTable
            rows={rankedRows}
            valueLabel={category.label}
            formatValue={(value) =>
              category.isRate ? formatRate(value) : String(value)
            }
          />
        </div>
      </div>
    </div>
  );
};
