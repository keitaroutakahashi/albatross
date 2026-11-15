"use client";

import { useState, useTransition } from "react";
import { fetchTeamStats } from "@/app/_actions/fetch-team-stats";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/shadcn/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/shadcn/tabs";
import { useNavigationProgressWhile } from "@/app/_components/ui/navigation-progress/use-navigation-progress-while";
import { ALL_SEASONS } from "@/app/_constants/stats";
import { AtBatNumberBatting } from "@/app/_features/stats/components/at-bat-number-batting";
import { BatHandBatting } from "@/app/_features/stats/components/bat-hand-batting";
import { GroundBatting } from "@/app/_features/stats/components/ground-batting";
import { GroundPitching } from "@/app/_features/stats/components/ground-pitching";
import { HitDirection } from "@/app/_features/stats/components/hit-direction";
import { MonthlyBatting } from "@/app/_features/stats/components/monthly-batting";
import { MonthlyPitching } from "@/app/_features/stats/components/monthly-pitching";
import { OrderBatting } from "@/app/_features/stats/components/order-batting";
import { PitchingStats } from "@/app/_features/stats/components/pitching-stats";
import { RolePitching } from "@/app/_features/stats/components/role-pitching";
import type { TeamStatsResult } from "@/app/_features/team/api/get-team-stats";
import { formatSeason } from "@/app/_utils/season";
import { AtBatResults } from "@/app/(public)/team-stats/_components/at-bat-results";
import { BattingIndicators } from "@/app/(public)/team-stats/_components/batting-indicators";
import { BattingTotal } from "@/app/(public)/team-stats/_components/batting-total";
import { GameFlow } from "@/app/(public)/team-stats/_components/game-flow";
import { InningScoring } from "@/app/(public)/team-stats/_components/inning-scoring";
import { PitchingIndicators } from "@/app/(public)/team-stats/_components/pitching-indicators";
import { RecordSummary } from "@/app/(public)/team-stats/_components/record-summary";
import { TeamSplitTable } from "@/app/(public)/team-stats/_components/team-split-table";
import type { SeasonModel } from "@/generated/prisma/models/Season";
import { cn } from "@/lib/utils";

type Props = {
  seasons: SeasonModel[];
  defaultSeason: string;
  initialStats: TeamStatsResult;
};

/**
 * `/team-stats` の年度切替とタブ表示を担うクライアントコンポーネント。
 * 年度切替時のみ Server Action で再取得する（クエリパラメータは使わない）。
 */
export const TeamStatsView = ({
  seasons,
  defaultSeason,
  initialStats,
}: Props) => {
  const [season, setSeason] = useState(defaultSeason);
  const [stats, setStats] = useState(initialStats);
  const [isPending, startTransition] = useTransition();
  useNavigationProgressWhile(isPending);

  const handleSeasonChange = (nextSeason: string) => {
    setSeason(nextSeason);
    startTransition(async () => {
      setStats(await fetchTeamStats(nextSeason));
    });
  };

  return (
    <div className="flex flex-col gap-y-6">
      <Select
        value={season}
        onValueChange={handleSeasonChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-full md:w-60">
          <SelectValue placeholder="年度を選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_SEASONS}>全年度</SelectItem>
          {seasons.map((s) => (
            <SelectItem key={s.id} value={String(s.season)}>
              {formatSeason(s.season)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <p className="text-xs text-gray-500">
        公式戦（終了した試合）の成績。勝敗・得点・失点は試合結果、打撃・投手の各成績は個人成績の合算です
      </p>

      <div
        className={cn(
          "flex flex-col gap-y-6 transition-opacity",
          isPending && "opacity-50",
        )}
      >
        <RecordSummary record={stats.record} />

        <Tabs defaultValue="batting">
          <TabsList>
            <TabsTrigger value="batting">打撃成績</TabsTrigger>
            <TabsTrigger value="pitching">投手成績</TabsTrigger>
            <TabsTrigger value="record">戦績</TabsTrigger>
          </TabsList>

          <TabsContent value="batting">
            <BattingTotal stats={stats} />
            <BattingIndicators batting={stats.batting} />
            <AtBatResults
              title="打席結果の内訳"
              rows={stats.atBatResults}
              rateHint="全打席に占める割合です。"
              emptyText="打席の記録がありません"
            />
            <AtBatResults
              title="アウトの内訳"
              rows={stats.outResults}
              rateHint="アウトになった打席に占める割合です。併殺打は 1 回として数えます。"
              emptyText="アウトの記録がありません"
            />
            <AtBatResults
              title="得点圏の内訳"
              rows={stats.scoringPositionResults}
              rateHint="得点圏（二塁または三塁に走者がいる状況）の打席に占める割合です。"
              emptyText="得点圏の打席の記録がありません"
            />
            <BatHandBatting rows={stats.batHandBatting} hideGames />
            <InningScoring rows={stats.inningScoring} mode="scored" />
            <HitDirection rows={stats.hitDirections} />
            <MonthlyBatting rows={stats.monthlyBatting} hideGames />
            <OrderBatting rows={stats.orderBatting} hideGames />
            <AtBatNumberBatting rows={stats.atBatNumberBatting} />
            <GroundBatting rows={stats.groundBatting} hideGames />
          </TabsContent>

          <TabsContent value="pitching">
            {stats.pitching ? (
              <>
                <PitchingStats
                  pitching={stats.pitching}
                  note="勝・敗は投手個人の勝敗の合計です。チームの勝敗はチーム戦績を参照してください"
                />
                <PitchingIndicators
                  pitching={stats.pitching}
                  usage={stats.pitchingUsage}
                />
                <InningScoring rows={stats.inningScoring} mode="allowed" />
                <RolePitching rows={stats.rolePitching} />
                <MonthlyPitching rows={stats.monthlyPitching} />
                <GroundPitching rows={stats.groundPitching} />
              </>
            ) : (
              <p className="text-sm text-gray-500">登板の記録がありません</p>
            )}
          </TabsContent>

          <TabsContent value="record">
            <GameFlow gameFlow={stats.gameFlow} />
            <TeamSplitTable
              title="月別"
              labelHeader="月"
              rows={stats.monthSplits}
            />
            <TeamSplitTable
              title="対戦相手別"
              labelHeader="対戦相手"
              rows={stats.opponentSplits}
            />
            <TeamSplitTable
              title="先攻・後攻別"
              labelHeader="攻撃"
              rows={stats.battingSideSplits}
            />
            <TeamSplitTable
              title="天候別"
              labelHeader="天候"
              rows={stats.weatherSplits}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
