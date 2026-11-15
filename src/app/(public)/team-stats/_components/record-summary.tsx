import { type ColumnDef, DataTable } from "@/app/_components/ui/data-table";
import { SubSectionGroup } from "@/app/_components/ui/sub-section-group";
import type { TeamRecord } from "@/app/_utils/stats/team-record";
import {
  formatRunAverage,
  formatRunDifferential,
  recordColumns,
} from "@/app/(public)/team-stats/_components/record-columns";

type Props = {
  record: TeamRecord;
};

const columns: ColumnDef<TeamRecord>[] = [
  ...recordColumns<TeamRecord>(),
  { key: "rs", header: "得点", cell: (r) => r.runsScored },
  { key: "ra", header: "失点", cell: (r) => r.runsAllowed },
  {
    key: "diff",
    header: "得失点差",
    cell: (r) => formatRunDifferential(r.runDifferential),
  },
  {
    key: "rsAvg",
    header: "平均得点",
    cell: (r) => formatRunAverage(r.runsScoredAverage),
  },
  {
    key: "raAvg",
    header: "平均失点",
    cell: (r) => formatRunAverage(r.runsAllowedAverage),
  },
];

/** 選択年度のチーム戦績。タブに関わらず常に表示する */
export const RecordSummary = ({ record }: Props) => (
  <SubSectionGroup title="チーム戦績">
    <DataTable columns={columns} data={[record]} keyExtractor={() => "total"} />
  </SubSectionGroup>
);
