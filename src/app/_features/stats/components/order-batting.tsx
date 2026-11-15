import { BattingSplitTable } from "@/app/_features/stats/components/batting-split-table";
import type { OrderBattingRow } from "@/app/_features/stats/utils/stats-splits";

type Props = {
  rows: OrderBattingRow[];
  /** 「試合」列を省くか */
  hideGames?: boolean;
};

/** 打順別の打撃成績 */
export const OrderBatting = ({ rows, hideGames }: Props) => (
  <BattingSplitTable
    title="打順別打撃成績"
    labelHeader="打順"
    getLabel={(r) => `${r.battingOrder}番`}
    getKey={(r) => String(r.battingOrder)}
    rows={rows}
    hideGames={hideGames}
  />
);
