import type { AtBatNumberBattingRow } from "@/app/_features/members/api/get-member-stats";
import { BattingSplitTable } from "@/app/(public)/members/[id]/_components/batting-split-table";

type Props = {
  rows: AtBatNumberBattingRow[];
};

/** 試合中の打席番号（何打席目か）別の打撃成績 */
export const AtBatNumberBatting = ({ rows }: Props) => (
  <BattingSplitTable
    title="打席番号別打撃成績"
    labelHeader="打席"
    getLabel={(r) => `${r.atBatNumber}打席目`}
    getKey={(r) => String(r.atBatNumber)}
    rows={rows}
    hideGames
  />
);
