import { SubSectionGroup } from "@/app/_components/ui/sub-section-group";
import { PITCHING_BENCHMARKS } from "@/app/_utils/stats/benchmarks";
import { formatInnings, OUTS_PER_INNING } from "@/app/_utils/stats/innings";
import { formatPitchCountPerInning } from "@/app/_utils/stats/pitch-count";
import type { PitchingSummary } from "@/app/_utils/stats/pitching-summary";
import type { PitchingUsage } from "@/app/_utils/stats/pitching-usage";
import { formatPercent } from "@/app/_utils/stats/rate";
import {
  IndicatorCard,
  IndicatorGrid,
} from "@/app/(public)/team-stats/_components/indicator-card";

type Props = {
  pitching: PitchingSummary;
  usage: PitchingUsage;
};

const formatDecimal = (value: number | null, digits: number): string =>
  value === null ? "-" : value.toFixed(digits);

const formatPercentBoundary = (value: number) => `${Math.round(value * 100)}%`;

/** 奪三振・与四球・球数の傾向と、投手の起用状況を目安と比べて見る指標 */
export const PitchingIndicators = ({ pitching, usage }: Props) => {
  const starterInnings =
    usage.starterAverageOuts === null
      ? null
      : usage.starterAverageOuts / OUTS_PER_INNING;

  return (
    <SubSectionGroup title="投手指標">
      <IndicatorGrid>
        <IndicatorCard
          label="K/7"
          hint="7 イニングあたりの奪三振数です。"
          valueText={formatDecimal(pitching.strikeoutsPerSeven, 2)}
          value={pitching.strikeoutsPerSeven}
          benchmark={PITCHING_BENCHMARKS.strikeoutsPerSeven}
          formatBoundary={(v) => v.toFixed(1)}
        />
        <IndicatorCard
          label="BB/7"
          hint="7 イニングあたりの与四球数です。"
          valueText={formatDecimal(pitching.walksPerSeven, 2)}
          value={pitching.walksPerSeven}
          benchmark={PITCHING_BENCHMARKS.walksPerSeven}
          formatBoundary={(v) => v.toFixed(1)}
        />
        <IndicatorCard
          label="K/BB"
          hint="奪三振 ÷ 与四球。大きいほど、制球がよい傾向です。"
          valueText={formatDecimal(pitching.strikeoutWalkRatio, 2)}
          value={pitching.strikeoutWalkRatio}
          benchmark={PITCHING_BENCHMARKS.strikeoutWalkRatio}
          formatBoundary={(v) => v.toFixed(1)}
        />
        <IndicatorCard
          label="球/回"
          hint="1 イニングあたりの平均球数です。球数が入力された登板だけで算出します。"
          valueText={formatPitchCountPerInning(pitching.pitchCountPerInning)}
          value={pitching.pitchCountPerInning}
          benchmark={PITCHING_BENCHMARKS.pitchCountPerInning}
          formatBoundary={(v) => v.toFixed(0)}
        />
        <IndicatorCard
          label="非自責割合"
          hint="失点のうち、失策などが絡んで自責点にならなかった割合です。高いときは守備の乱れが失点につながっています。"
          valueText={formatPercent(pitching.unearnedRunRate)}
          sub={`${pitching.unearnedRuns} 点`}
          value={pitching.unearnedRunRate}
          benchmark={PITCHING_BENCHMARKS.unearnedRunRate}
          formatBoundary={formatPercentBoundary}
        />
        <IndicatorCard
          label="先発平均投球回"
          hint="先発投手が 1 試合で投げたイニング数の平均です。"
          valueText={
            usage.starterAverageOuts === null
              ? "-"
              : formatInnings(Math.round(usage.starterAverageOuts))
          }
          value={starterInnings}
          benchmark={PITCHING_BENCHMARKS.starterInnings}
          formatBoundary={(v) => `${v} 回`}
        />
        <IndicatorCard
          label="投手数/試合"
          hint="1 試合あたりに登板した投手数の平均です。多いほど先発が長く持たず、継投に頼っています。1.5 人未満は判定しません。"
          valueText={formatDecimal(usage.pitchersPerGame, 1)}
          value={usage.pitchersPerGame}
          benchmark={PITCHING_BENCHMARKS.pitchersPerGame}
          formatBoundary={(v) => `${v} 人`}
        />
      </IndicatorGrid>
    </SubSectionGroup>
  );
};
