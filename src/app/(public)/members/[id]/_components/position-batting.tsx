import { positionFullLabel } from "@/app/_constants/labels";
import type { PositionBattingRow } from "@/app/_features/members/api/get-member-stats";
import { BattingSplitTable } from "@/app/(public)/members/[id]/_components/batting-split-table";

type Props = {
  rows: PositionBattingRow[];
};

/** 守備位置別の打撃成績 */
export const PositionBatting = ({ rows }: Props) => (
  <BattingSplitTable
    title="守備位置別打撃成績"
    labelHeader="守備位置"
    getLabel={(r) => positionFullLabel[r.position]}
    getKey={(r) => r.position}
    rows={rows}
  />
);
