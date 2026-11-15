import { type ColumnDef, DataTable } from "@/app/_components/ui/data-table";
import { SubSectionGroup } from "@/app/_components/ui/sub-section-group";
import { formatInnings } from "@/app/_utils/stats/innings";
import { formatPitchCountPerInning } from "@/app/_utils/stats/pitch-count";
import type { PitchingSummary } from "@/app/_utils/stats/pitching-summary";
import type { PitchingUsage } from "@/app/_utils/stats/pitching-usage";
import { HeaderWithHint } from "@/app/(public)/team-stats/_components/header-with-hint";

type Props = {
  pitching: PitchingSummary;
  usage: PitchingUsage;
};

type Row = PitchingSummary & PitchingUsage;

const formatDecimal = (value: number | null, digits: number): string =>
  value === null ? "-" : value.toFixed(digits);

const columns: ColumnDef<Row>[] = [
  {
    key: "k7",
    header: (
      <HeaderWithHint label="K/7" hint="7 イニングあたりの奪三振数です。" />
    ),
    cell: (r) => formatDecimal(r.strikeoutsPerSeven, 2),
  },
  {
    key: "bb7",
    header: (
      <HeaderWithHint label="BB/7" hint="7 イニングあたりの与四球数です。" />
    ),
    cell: (r) => formatDecimal(r.walksPerSeven, 2),
  },
  {
    key: "kbb",
    header: (
      <HeaderWithHint
        label="K/BB"
        hint="奪三振 ÷ 与四球。大きいほど、制球がよい傾向です。"
      />
    ),
    cell: (r) => formatDecimal(r.strikeoutWalkRatio, 2),
  },
  {
    key: "pitchesPerInning",
    header: (
      <HeaderWithHint
        label="球/回"
        hint="1 イニングあたりの平均球数です。球数が入力された登板だけで算出します。"
      />
    ),
    cell: (r) => formatPitchCountPerInning(r.pitchCountPerInning),
  },
  {
    key: "unearned",
    header: (
      <HeaderWithHint
        label="非自責点"
        hint="失点 − 自責点。失策などが絡んだ、自責点にならない失点です。"
      />
    ),
    cell: (r) => r.unearnedRuns,
  },
  {
    key: "pitchers",
    header: (
      <HeaderWithHint
        label="投手数/試合"
        hint="1 試合あたりに登板した投手数の平均です。"
      />
    ),
    cell: (r) => formatDecimal(r.pitchersPerGame, 1),
  },
  {
    key: "starterIp",
    header: (
      <HeaderWithHint
        label="先発平均投球回"
        hint="先発投手が 1 試合で投げたイニング数の平均です。"
      />
    ),
    cell: (r) =>
      r.starterAverageOuts === null
        ? "-"
        : formatInnings(Math.round(r.starterAverageOuts)),
  },
];

/** 奪三振・与四球・球数の傾向と、投手の起用状況 */
export const PitchingIndicators = ({ pitching, usage }: Props) => (
  <SubSectionGroup title="投手指標">
    <DataTable
      columns={columns}
      data={[{ ...pitching, ...usage }]}
      keyExtractor={() => "total"}
    />
  </SubSectionGroup>
);
