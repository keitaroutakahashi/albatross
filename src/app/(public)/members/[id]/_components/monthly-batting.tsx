import type { MonthlyBattingRow } from "@/app/_features/members/api/get-member-stats";
import { BattingSplitTable } from "@/app/(public)/members/[id]/_components/batting-split-table";

type Props = {
  rows: MonthlyBattingRow[];
};

/** 月別の打撃成績（全年度のときは年をまたいで同じ月を合算） */
export const MonthlyBatting = ({ rows }: Props) => (
  <BattingSplitTable
    title="月別打撃成績"
    labelHeader="月"
    getLabel={(r) => `${r.month}月`}
    getKey={(r) => String(r.month)}
    rows={rows}
  />
);
