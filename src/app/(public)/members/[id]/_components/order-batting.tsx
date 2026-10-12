import type { OrderBattingRow } from "@/app/_features/members/api/get-member-stats";
import { BattingSplitTable } from "@/app/(public)/members/[id]/_components/batting-split-table";

type Props = {
  rows: OrderBattingRow[];
};

/** 打順別の打撃成績 */
export const OrderBatting = ({ rows }: Props) => (
  <BattingSplitTable
    title="打順別打撃成績"
    labelHeader="打順"
    getLabel={(r) => `${r.battingOrder}番`}
    getKey={(r) => String(r.battingOrder)}
    rows={rows}
  />
);
