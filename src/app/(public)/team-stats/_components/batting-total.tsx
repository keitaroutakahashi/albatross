import { type ColumnDef, DataTable } from "@/app/_components/ui/data-table";
import { SubSectionGroup } from "@/app/_components/ui/sub-section-group";
import type { TeamStatsResult } from "@/app/_features/team/api/get-team-stats";
import { formatRate } from "@/app/_utils/stats/rate";

type Props = {
  stats: TeamStatsResult;
};

type Row = TeamStatsResult["batting"] &
  Pick<TeamStatsResult, "stolenBases"> & {
    /** 試合結果の得点（個人の打点の合計とは一致しない） */
    runs: number;
  };

const columns: ColumnDef<Row>[] = [
  { key: "runs", header: "得点", cell: (r) => r.runs },
  { key: "pa", header: "打席", cell: (r) => r.plateAppearances },
  { key: "ab", header: "打数", cell: (r) => r.atBats },
  { key: "h", header: "安打", cell: (r) => r.hits },
  { key: "1b", header: "単打", cell: (r) => r.singles },
  { key: "2b", header: "二塁打", cell: (r) => r.doubles },
  { key: "3b", header: "三塁打", cell: (r) => r.triples },
  { key: "hr", header: "本塁打", cell: (r) => r.homeRuns },
  { key: "rbi", header: "打点", cell: (r) => r.rbi },
  { key: "sb", header: "盗塁", cell: (r) => r.stolenBases },
  { key: "bb", header: "四死球", cell: (r) => r.walks },
  { key: "so", header: "三振", cell: (r) => r.strikeouts },
  { key: "sh", header: "犠打", cell: (r) => r.sacrificeHits },
  { key: "sf", header: "犠飛", cell: (r) => r.sacrificeFlies },
  { key: "avg", header: "打率", cell: (r) => formatRate(r.average) },
  { key: "obp", header: "出塁率", cell: (r) => formatRate(r.onBasePercentage) },
  {
    key: "slg",
    header: "長打率",
    cell: (r) => formatRate(r.sluggingPercentage),
  },
  { key: "ops", header: "OPS", cell: (r) => formatRate(r.ops) },
  {
    key: "risp",
    header: "得点圏",
    cell: (r) => formatRate(r.scoringPositionAverage),
  },
];

/** チーム全体の通算（選択年度）の打撃成績 */
export const BattingTotal = ({ stats }: Props) => {
  const row: Row = {
    ...stats.batting,
    stolenBases: stats.stolenBases,
    runs: stats.record.runsScored,
  };

  return (
    <SubSectionGroup title="打撃成績">
      <DataTable columns={columns} data={[row]} keyExtractor={() => "total"} />
    </SubSectionGroup>
  );
};
