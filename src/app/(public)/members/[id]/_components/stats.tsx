"use client";

import { useState, useTransition } from "react";
import { fetchMemberStats } from "@/app/_actions/fetch-member-stats";
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
import { SectionGroup } from "@/app/_components/ui/section-group";
import { ALL_SEASONS } from "@/app/_constants/stats";
import type { MemberStatsResult } from "@/app/_features/members/api/get-member-stats";
import { AtBatNumberBatting } from "@/app/(public)/members/[id]/_components/at-bat-number-batting";
import { BattingStats } from "@/app/(public)/members/[id]/_components/batting-stats";
import { GroundBatting } from "@/app/(public)/members/[id]/_components/ground-batting";
import { GroundPitching } from "@/app/(public)/members/[id]/_components/ground-pitching";
import { HitDirection } from "@/app/(public)/members/[id]/_components/hit-direction";
import { MonthlyBatting } from "@/app/(public)/members/[id]/_components/monthly-batting";
import { MonthlyPitching } from "@/app/(public)/members/[id]/_components/monthly-pitching";
import { OrderBatting } from "@/app/(public)/members/[id]/_components/order-batting";
import { PitchingStats } from "@/app/(public)/members/[id]/_components/pitching-stats";
import { PositionBatting } from "@/app/(public)/members/[id]/_components/position-batting";
import { PositionGames } from "@/app/(public)/members/[id]/_components/position-games";
import { RolePitching } from "@/app/(public)/members/[id]/_components/role-pitching";
import type { SeasonModel } from "@/generated/prisma/models/Season";
import { cn } from "@/lib/utils";

type Props = {
  memberId: number;
  seasons: SeasonModel[];
  initialStats: MemberStatsResult;
};

/**
 * 選手詳細の成績セクション。
 * 年度切替時のみ Server Action で再取得する（クエリパラメータは使わない）。
 */
export const Stats = ({ memberId, seasons, initialStats }: Props) => {
  const [season, setSeason] = useState(initialStats.season);
  const [stats, setStats] = useState(initialStats);
  const [isPending, startTransition] = useTransition();

  const handleSeasonChange = (nextSeason: string) => {
    setSeason(nextSeason);
    startTransition(async () => {
      setStats(await fetchMemberStats(memberId, nextSeason));
    });
  };

  return (
    <SectionGroup title="成績">
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
              {s.season} シーズン
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <p className="text-xs text-gray-500">公式戦（終了した試合）の成績</p>

      <div
        className={cn(
          "flex flex-col gap-y-6 transition-opacity",
          isPending && "opacity-50",
        )}
      >
        <Tabs defaultValue="batting">
          <TabsList>
            <TabsTrigger value="batting">打撃成績</TabsTrigger>
            <TabsTrigger value="pitching">投手成績</TabsTrigger>
          </TabsList>

          <TabsContent value="batting">
            <BattingStats stats={stats} />
            <HitDirection rows={stats.hitDirections} />
            <MonthlyBatting rows={stats.monthlyBatting} />
            <OrderBatting rows={stats.orderBatting} />
            <AtBatNumberBatting rows={stats.atBatNumberBatting} />
            <PositionBatting rows={stats.positionBatting} />
            <GroundBatting rows={stats.groundBatting} />
            <PositionGames rows={stats.positionGames} />
          </TabsContent>

          <TabsContent value="pitching">
            {stats.pitching ? (
              <>
                <PitchingStats pitching={stats.pitching} />
                <RolePitching rows={stats.rolePitching} />
                <MonthlyPitching rows={stats.monthlyPitching} />
                <GroundPitching rows={stats.groundPitching} />
              </>
            ) : (
              <p className="text-sm text-gray-500">登板の記録がありません</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </SectionGroup>
  );
};
