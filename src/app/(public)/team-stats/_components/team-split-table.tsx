import { type ColumnDef, DataTable } from "@/app/_components/ui/data-table";
import { SubSectionGroup } from "@/app/_components/ui/sub-section-group";
import type { TeamSplitRow } from "@/app/_features/team/api/get-team-stats";
import { formatEra } from "@/app/_utils/stats/era";
import { formatRate } from "@/app/_utils/stats/rate";
import { recordColumns } from "@/app/(public)/team-stats/_components/record-columns";

type Props = {
  title: string;
  /** 切り口の列（先頭列）の見出し */
  labelHeader: string;
  rows: TeamSplitRow[];
};

/** 対戦相手別・先攻後攻別・天候別など、切り口ごとの戦績と主な成績の表 */
export const TeamSplitTable = ({ title, labelHeader, rows }: Props) => {
  const columns: ColumnDef<TeamSplitRow>[] = [
    { key: "label", header: labelHeader, align: "left", cell: (r) => r.label },
    ...recordColumns<TeamSplitRow>(),
    { key: "rs", header: "得点", cell: (r) => r.runsScored },
    { key: "ra", header: "失点", cell: (r) => r.runsAllowed },
    { key: "avg", header: "打率", cell: (r) => formatRate(r.battingAverage) },
    { key: "ops", header: "OPS", cell: (r) => formatRate(r.ops) },
    { key: "era", header: "防御率", cell: (r) => formatEra(r.era) },
  ];

  return (
    <SubSectionGroup title={title}>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-500">記録がありません</p>
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          keyExtractor={(r) => r.key}
          sticky={{ count: 1, offsets: ["left-0"] }}
        />
      )}
    </SubSectionGroup>
  );
};
