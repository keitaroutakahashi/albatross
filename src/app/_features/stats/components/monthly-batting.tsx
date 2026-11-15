import { BattingSplitTable } from "@/app/_features/stats/components/batting-split-table";
import type { MonthlyBattingRow } from "@/app/_features/stats/utils/stats-splits";

type Props = {
  rows: MonthlyBattingRow[];
  /** 「試合」列を省くか */
  hideGames?: boolean;
};

/** 月別の打撃成績（全年度のときは年をまたいで同じ月を合算） */
export const MonthlyBatting = ({ rows, hideGames }: Props) => (
  <BattingSplitTable
    title="月別打撃成績"
    labelHeader="月"
    getLabel={(r) => `${r.month}月`}
    getKey={(r) => String(r.month)}
    rows={rows}
    hideGames={hideGames}
  />
);
