"use client";

import { useMemo, useState, useTransition } from "react";
import { fetchPitchingStats } from "@/app/_actions/fetch-pitching-stats";
import { StatsFilterBar } from "@/app/_components/ui/stats-filter-bar";
import { StatsRankingTable } from "@/app/_components/ui/stats-ranking-table";
import type { PitchingStatsResult } from "@/app/_features/members/api/get-pitching-stats";
import { rankMemberStats } from "@/app/_features/members/utils/ranking";
import { PITCHING_CATEGORIES } from "@/app/(public)/pitching-stats/_components/categories";
import type { SeasonModel } from "@/generated/prisma/models/Season";

type Props = {
  seasons: SeasonModel[];
  defaultSeason: string;
  initialStats: PitchingStatsResult;
};

/**
 * `/pitching-stats` の年度・指標フィルタとランキング表示を担うクライアントコンポーネント。
 * クエリパラメータを使わないため、年度切替時のみ Server Action で再取得し、
 * 指標切替・規定投球回フィルタはクライアント側で完結させる。
 */
export const PitchingStatsView = ({
  seasons,
  defaultSeason,
  initialStats,
}: Props) => {
  const [season, setSeason] = useState(defaultSeason);
  const [categoryKey, setCategoryKey] =
    useState<(typeof PITCHING_CATEGORIES)[number]["key"]>("era");
  const [qualifiedOnly, setQualifiedOnly] = useState(true);
  const [stats, setStats] = useState(initialStats);
  const [isPending, startTransition] = useTransition();

  const category =
    PITCHING_CATEGORIES.find((c) => c.key === categoryKey) ??
    PITCHING_CATEGORIES[0];

  const handleSeasonChange = (nextSeason: string) => {
    setSeason(nextSeason);
    startTransition(async () => {
      const nextStats = await fetchPitchingStats(nextSeason);
      setStats(nextStats);
    });
  };

  const rankedRows = useMemo(() => {
    const rows = stats.rows.filter((row) => {
      const value = row[category.key];
      if (typeof value !== "number") return false;
      if (category.isRegulated && qualifiedOnly && !row.isQualified) {
        return false;
      }
      return true;
    });

    return rankMemberStats(
      rows,
      (row) => row[category.key] as number,
      category.order,
    );
  }, [stats.rows, category, qualifiedOnly]);

  return (
    <div className="flex flex-col gap-y-6">
      <StatsFilterBar
        seasons={seasons}
        season={season}
        onSeasonChange={handleSeasonChange}
        categories={PITCHING_CATEGORIES}
        categoryKey={categoryKey}
        onCategoryChange={(key) =>
          setCategoryKey(key as (typeof PITCHING_CATEGORIES)[number]["key"])
        }
        qualifiedOnly={qualifiedOnly}
        onQualifiedChange={setQualifiedOnly}
        qualifiedLabel="規定投球回"
        qualifiedHint="規定投球回: 10 イニング以上、またはシーズンの試合数以上を投げていること"
        qualifiedDisabled={!category.isRegulated}
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
            formatValue={category.format}
          />
        </div>
      </div>
    </div>
  );
};
