import { type ColumnDef, DataTable } from "@/app/_components/ui/data-table";
import { SubSectionGroup } from "@/app/_components/ui/sub-section-group";
import { pitchingColumns } from "@/app/_features/stats/components/pitching-columns";
import type {
  PitchingRole,
  RolePitchingRow,
} from "@/app/_features/stats/utils/stats-splits";

type Props = {
  rows: RolePitchingRow[];
};

const ROLE_LABEL: Record<PitchingRole, string> = {
  starter: "先発",
  reliever: "中継ぎ",
};

const columns: ColumnDef<RolePitchingRow>[] = [
  {
    key: "role",
    header: "区分",
    align: "left",
    cell: (r) => ROLE_LABEL[r.role],
  },
  // 区分で先発かどうかが分かるため、先発登板数の列は省く
  ...pitchingColumns<RolePitchingRow>().filter((c) => c.key !== "starts"),
];

/** 先発・救援別の投球成績 */
export const RolePitching = ({ rows }: Props) => (
  <SubSectionGroup title="先発・中継ぎ別投手成績">
    <DataTable
      columns={columns}
      data={rows}
      keyExtractor={(r) => r.role}
      sticky={{ count: 1, offsets: ["left-0"] }}
    />
  </SubSectionGroup>
);
