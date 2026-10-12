import { type ColumnDef, DataTable } from "@/app/_components/ui/data-table";
import { SubSectionGroup } from "@/app/_components/ui/sub-section-group";
import { positionFullLabel } from "@/app/_constants/labels";
import type { PositionGamesRow } from "@/app/_features/members/api/get-member-stats";

type Props = {
  rows: PositionGamesRow[];
};

const columns: ColumnDef<PositionGamesRow>[] = [
  {
    key: "position",
    header: "守備位置",
    align: "left",
    cell: (r) => positionFullLabel[r.position],
  },
  { key: "games", header: "試合数", cell: (r) => r.games },
];

/** 守備位置ごとの出場試合数 */
export const PositionGames = ({ rows }: Props) => (
  <SubSectionGroup title="守備位置別試合数">
    {rows.length === 0 ? (
      <p className="text-sm text-gray-500">守備位置の記録がありません</p>
    ) : (
      <DataTable
        columns={columns}
        data={rows}
        keyExtractor={(r) => r.position}
      />
    )}
  </SubSectionGroup>
);
