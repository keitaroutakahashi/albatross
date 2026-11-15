import { BattingSplitTable } from "@/app/_features/stats/components/batting-split-table";
import type { GroundBattingRow } from "@/app/_features/stats/utils/stats-splits";

type Props = {
  rows: GroundBattingRow[];
  /** 「試合」列を省くか */
  hideGames?: boolean;
};

/** グラウンド別の打撃成績 */
export const GroundBatting = ({ rows, hideGames }: Props) => (
  <BattingSplitTable
    title="グラウンド別打撃成績"
    labelHeader="グラウンド"
    getLabel={(r) => r.groundName}
    getKey={(r) => String(r.groundId ?? "unknown")}
    rows={rows}
    hideGames={hideGames}
  />
);
