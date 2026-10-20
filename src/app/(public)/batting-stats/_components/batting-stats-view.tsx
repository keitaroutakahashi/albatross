"use client";

import { useMemo, useState, useTransition } from "react";
import { fetchBattingStats } from "@/app/_actions/fetch-batting-stats";
import { useNavigationProgressWhile } from "@/app/_components/ui/navigation-progress/use-navigation-progress-while";
import { StatsFilterBar } from "@/app/_components/ui/stats-filter-bar";
import { StatsRankingTable } from "@/app/_components/ui/stats-ranking-table";
import {
  ALL_LEAGUES,
  toLeagueId,
} from "@/app/_features/leagues/utils/league-filter";
import type { BattingStatsResult } from "@/app/_features/members/api/get-batting-stats";
import { rankMemberStats } from "@/app/_features/members/utils/ranking";
import { formatSeason } from "@/app/_utils/season";
import { formatRate } from "@/app/_utils/stats/rate";
import { BATTING_CATEGORIES } from "@/app/(public)/batting-stats/_components/categories";
import type { LeagueModel } from "@/generated/prisma/models/League";
import type { SeasonModel } from "@/generated/prisma/models/Season";

type Props = {
  seasons: SeasonModel[];
  leagues: LeagueModel[];
  defaultSeason: string;
  initialStats: BattingStatsResult;
};

/**
 * `/batting-stats` の年度・リーグ・指標フィルタとランキング表示を担うクライアントコンポーネント。
 * クエリパラメータを使わないため、年度切替時のみ Server Action で再取得し、
 * 指標切替・規定打席フィルタはクライアント側で完結させる。
 */
export const BattingStatsView = ({
  seasons,
  leagues,
  defaultSeason,
  initialStats,
}: Props) => {
  const [season, setSeason] = useState(defaultSeason);
  const [league, setLeague] = useState(ALL_LEAGUES);
  const [categoryKey, setCategoryKey] =
    useState<(typeof BATTING_CATEGORIES)[number]["key"]>("average");
  const [qualifiedOnly, setQualifiedOnly] = useState(true);
  const [stats, setStats] = useState(initialStats);
  const [isPending, startTransition] = useTransition();
  useNavigationProgressWhile(isPending);

  const category =
    BATTING_CATEGORIES.find((c) => c.key === categoryKey) ??
    BATTING_CATEGORIES[0];

  /** 年度・リーグのどちらを変えても、両方の選択値で再取得する */
  const reload = (nextSeason: string, nextLeague: string) => {
    startTransition(async () => {
      const nextStats = await fetchBattingStats(
        nextSeason,
        toLeagueId(nextLeague),
      );
      setStats(nextStats);
    });
  };

  const handleSeasonChange = (nextSeason: string) => {
    setSeason(nextSeason);
    reload(nextSeason, league);
  };

  const handleLeagueChange = (nextLeague: string) => {
    setLeague(nextLeague);
    reload(season, nextLeague);
  };

  // 表示中のデータに合わせた見出し（再取得中も、取得済みのデータのリーグを出す）
  const leagueName = leagues.find((l) => l.id === stats.leagueId)?.name;

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
        leagues={leagues}
        league={league}
        onLeagueChange={handleLeagueChange}
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
            {[
              formatSeason(stats.season),
              leagueName,
              `公式戦 全${stats.gameCount}試合`,
            ]
              .filter(Boolean)
              .join(" / ")}
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
