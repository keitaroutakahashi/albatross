import { type ColumnDef, DataTable } from "@/app/_components/ui/data-table";
import { SubSectionGroup } from "@/app/_components/ui/sub-section-group";
import type { MemberStatsResult } from "@/app/_features/members/api/get-member-stats";
import { formatRate } from "@/app/_utils/stats/rate";

type Props = {
  stats: MemberStatsResult;
};

type Row = MemberStatsResult["batting"] &
  Pick<MemberStatsResult, "games" | "stolenBases">;

const columns: ColumnDef<Row>[] = [
  { key: "games", header: "試合", cell: (r) => r.games },
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

/** 通算（選択年度）の打撃成績 */
export const BattingStats = ({ stats }: Props) => {
  const row: Row = {
    ...stats.batting,
    games: stats.games,
    stolenBases: stats.stolenBases,
  };

  return (
    <SubSectionGroup title="打撃成績">
      <DataTable columns={columns} data={[row]} keyExtractor={() => "total"} />
    </SubSectionGroup>
  );
};
