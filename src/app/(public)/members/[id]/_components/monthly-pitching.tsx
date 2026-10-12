import { type ColumnDef, DataTable } from "@/app/_components/ui/data-table";
import { SubSectionGroup } from "@/app/_components/ui/sub-section-group";
import type { MonthlyPitchingRow } from "@/app/_features/members/api/get-member-stats";
import { pitchingColumns } from "@/app/(public)/members/[id]/_components/pitching-columns";

type Props = {
  rows: MonthlyPitchingRow[];
};

const columns: ColumnDef<MonthlyPitchingRow>[] = [
  {
    key: "month",
    header: "月",
    align: "left",
    cell: (r) => `${r.month}月`,
  },
  ...pitchingColumns<MonthlyPitchingRow>(),
];

/** 月別の投球成績（全年度のときは年をまたいで同じ月を合算） */
export const MonthlyPitching = ({ rows }: Props) => (
  <SubSectionGroup title="月別投球成績">
    <DataTable
      columns={columns}
      data={rows}
      keyExtractor={(r) => String(r.month)}
      sticky={{ count: 1, offsets: ["left-0"] }}
    />
  </SubSectionGroup>
);
