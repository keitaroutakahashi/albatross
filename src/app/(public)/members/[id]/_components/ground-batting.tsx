import type { GroundBattingRow } from "@/app/_features/members/api/get-member-stats";
import { BattingSplitTable } from "@/app/(public)/members/[id]/_components/batting-split-table";

type Props = {
  rows: GroundBattingRow[];
};

/** グラウンド別の打撃成績 */
export const GroundBatting = ({ rows }: Props) => (
  <BattingSplitTable
    title="グラウンド別打撃成績"
    labelHeader="グラウンド"
    getLabel={(r) => r.groundName}
    getKey={(r) => String(r.groundId ?? "unknown")}
    rows={rows}
  />
);
