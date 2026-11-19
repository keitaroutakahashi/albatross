import { SubSectionGroup } from "@/app/_components/ui/sub-section-group";
import type { TeamStatsResult } from "@/app/_features/team/api/get-team-stats";
import { BATTING_BENCHMARKS } from "@/app/_utils/stats/benchmarks";
import { formatPercent, formatRate } from "@/app/_utils/stats/rate";
import {
  IndicatorCard,
  IndicatorGrid,
} from "@/app/(public)/team-stats/_components/indicator-card";

type Props = {
  stats: Pick<
    TeamStatsResult,
    "batting" | "scoringRate" | "stolenBasesPerGame" | "sacrificeHitsPerGame"
  >;
};

const formatPercentBoundary = (value: number) => `${Math.round(value * 100)}%`;

const formatPerGame = (value: number | null) =>
  value === null ? "-" : value.toFixed(2);

/** 長打力・選球眼・走者を返す力など、チームの打撃の傾向を目安と比べて見る指標 */
export const BattingIndicators = ({ stats }: Props) => {
  const { batting } = stats;

  return (
    <SubSectionGroup title="打者指標">
      <IndicatorGrid>
        <IndicatorCard
          label="ISO"
          hint="長打率 − 打率。単打を除いた、長打力の目安です。"
          valueText={formatRate(batting.iso)}
          value={batting.iso}
          benchmark={BATTING_BENCHMARKS.iso}
          formatBoundary={formatRate}
        />
        <IndicatorCard
          label="長打割合"
          hint="安打のうち、二塁打・三塁打・本塁打が占める割合です。打率に左右されず、長打の出やすさを見られます。"
          valueText={formatPercent(batting.extraBaseHitRate)}
          value={batting.extraBaseHitRate}
          benchmark={BATTING_BENCHMARKS.extraBaseHitRate}
          formatBoundary={formatPercentBoundary}
        />
        <IndicatorCard
          label="BABIP"
          hint="本塁打を除くインプレー打球が安打になった割合です。運の影響が大きく、高すぎると次は下がりやすく、低すぎるときは不運のことも多いです。"
          valueText={formatRate(batting.babip)}
          value={batting.babip}
          benchmark={BATTING_BENCHMARKS.babip}
          formatBoundary={formatRate}
        />
        <IndicatorCard
          label="生還率"
          hint="得点 ÷ (安打 + 四死球)。出塁した走者のうち、ホームに還った割合の目安です。失策などでの出塁は含みません。"
          valueText={formatPercent(stats.scoringRate)}
          value={stats.scoringRate}
          benchmark={BATTING_BENCHMARKS.scoringRate}
          formatBoundary={formatPercentBoundary}
        />
        <IndicatorCard
          label="四死球率"
          hint="打席のうち、四死球で出塁した割合です。"
          valueText={formatPercent(batting.walkRate)}
          value={batting.walkRate}
          benchmark={BATTING_BENCHMARKS.walkRate}
          formatBoundary={formatPercentBoundary}
        />
        <IndicatorCard
          label="三振率"
          hint="打席のうち、三振に終わった割合です。"
          valueText={formatPercent(batting.strikeoutRate)}
          value={batting.strikeoutRate}
          benchmark={BATTING_BENCHMARKS.strikeoutRate}
          formatBoundary={formatPercentBoundary}
        />
        <IndicatorCard
          label="BB/K"
          hint="四死球 ÷ 三振。大きいほど、選球眼がよい傾向です。"
          valueText={
            batting.walkStrikeoutRatio === null
              ? "-"
              : batting.walkStrikeoutRatio.toFixed(2)
          }
          value={batting.walkStrikeoutRatio}
          benchmark={BATTING_BENCHMARKS.walkStrikeoutRatio}
          formatBoundary={(v) => v.toFixed(1)}
        />
        <IndicatorCard
          label="盗塁 / 試合"
          hint="1 試合あたりの盗塁数です。失敗は記録していないため、成功した盗塁だけです。"
          valueText={formatPerGame(stats.stolenBasesPerGame)}
          sub={`犠打 ${formatPerGame(stats.sacrificeHitsPerGame)} / 試合`}
        />
      </IndicatorGrid>
    </SubSectionGroup>
  );
};
