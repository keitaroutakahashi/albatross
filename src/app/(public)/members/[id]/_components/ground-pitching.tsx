import { type ColumnDef, DataTable } from "@/app/_components/ui/data-table";
import { SubSectionGroup } from "@/app/_components/ui/sub-section-group";
import type { GroundPitchingRow } from "@/app/_features/members/api/get-member-stats";
import { pitchingColumns } from "@/app/(public)/members/[id]/_components/pitching-columns";

type Props = {
  rows: GroundPitchingRow[];
};

const columns: ColumnDef<GroundPitchingRow>[] = [
  {
    key: "ground",
    header: "グラウンド",
    align: "left",
    cell: (r) => r.groundName,
  },
  ...pitchingColumns<GroundPitchingRow>(),
];

/** グラウンド別の投球成績 */
export const GroundPitching = ({ rows }: Props) => (
  <SubSectionGroup title="グラウンド別投球成績">
    <DataTable
      columns={columns}
      data={rows}
      keyExtractor={(r) => String(r.groundId ?? "unknown")}
      sticky={{ count: 1, offsets: ["left-0"] }}
    />
  </SubSectionGroup>
);
