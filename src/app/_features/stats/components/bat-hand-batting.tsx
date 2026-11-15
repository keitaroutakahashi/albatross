import { handLabel } from "@/app/_constants/labels";
import { BattingSplitTable } from "@/app/_features/stats/components/batting-split-table";
import type { BatHandBattingRow } from "@/app/_features/stats/utils/stats-splits";

type Props = {
  rows: BatHandBattingRow[];
  /** 「試合」列を省くか */
  hideGames?: boolean;
};

/** 右打者・左打者（両打ちを含む）別の打撃成績 */
export const BatHandBatting = ({ rows, hideGames }: Props) => (
  <BattingSplitTable
    title="右打者・左打者別打撃成績"
    labelHeader="打者"
    getLabel={(r) => `${handLabel[r.batHand]}打者`}
    getKey={(r) => r.batHand}
    rows={rows}
    hideGames={hideGames}
  />
);
