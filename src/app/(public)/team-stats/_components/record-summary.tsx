import { type ColumnDef, DataTable } from "@/app/_components/ui/data-table";
import { SubSectionGroup } from "@/app/_components/ui/sub-section-group";
import type { TeamRecord } from "@/app/_utils/stats/team-record";
import {
  formatRunAverage,
  formatRunDifferential,
  recordColumns,
} from "@/app/(public)/team-stats/_components/record-columns";
import { StackedBar } from "@/app/(public)/team-stats/_components/stacked-bar";

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
    <div className="flex flex-col gap-y-3">
      <DataTable
        columns={columns}
        data={[record]}
        keyExtractor={() => "total"}
      />

      {record.games > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-y-1">
            <h4 className="text-xs font-bold text-gray-700">勝敗</h4>
            <StackedBar
              ariaLabel={`勝敗: ${record.wins} 勝 ${record.losses} 敗 ${record.draws} 分`}
              segments={[
                {
                  key: "win",
                  label: "勝",
                  value: record.wins,
                  className: "bg-emerald-500",
                },
                {
                  key: "draw",
                  label: "分",
                  value: record.draws,
                  className: "bg-gray-300",
                },
                {
                  key: "lose",
                  label: "敗",
                  value: record.losses,
                  className: "bg-rose-400",
                },
              ]}
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <h4 className="text-xs font-bold text-gray-700">得点と失点</h4>
            <StackedBar
              ariaLabel={`得点 ${record.runsScored}、失点 ${record.runsAllowed}`}
              segments={[
                {
                  key: "scored",
                  label: "得点",
                  value: record.runsScored,
                  className: "bg-primary",
                },
                {
                  key: "allowed",
                  label: "失点",
                  value: record.runsAllowed,
                  className: "bg-rose-400",
                },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  </SubSectionGroup>
);
