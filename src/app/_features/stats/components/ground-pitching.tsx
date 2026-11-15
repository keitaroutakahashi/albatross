import { type ColumnDef, DataTable } from "@/app/_components/ui/data-table";
import { SubSectionGroup } from "@/app/_components/ui/sub-section-group";
import { pitchingColumns } from "@/app/_features/stats/components/pitching-columns";
import type { GroundPitchingRow } from "@/app/_features/stats/utils/stats-splits";

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
