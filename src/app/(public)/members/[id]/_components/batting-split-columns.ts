import type { ColumnDef } from "@/app/_components/ui/data-table";
import type { BattingSplitRow } from "@/app/_features/members/api/get-member-stats";
import { formatRate } from "@/app/_utils/stats/rate";

/** グラウンド別・月別など、切り口ごとの打撃成績表で共通の列（切り口の列は含まない） */
export const battingSplitColumns = <
  T extends BattingSplitRow,
>(): ColumnDef<T>[] => [
  { key: "games", header: "試合", cell: (r) => r.games },
  { key: "pa", header: "打席", cell: (r) => r.plateAppearances },
  { key: "ab", header: "打数", cell: (r) => r.atBats },
  { key: "h", header: "安打", cell: (r) => r.hits },
  { key: "1b", header: "単打", cell: (r) => r.singles },
  { key: "2b", header: "二塁打", cell: (r) => r.doubles },
  { key: "3b", header: "三塁打", cell: (r) => r.triples },
  { key: "hr", header: "本塁打", cell: (r) => r.homeRuns },
  { key: "rbi", header: "打点", cell: (r) => r.rbi },
  { key: "avg", header: "打率", cell: (r) => formatRate(r.average) },
  { key: "obp", header: "出塁率", cell: (r) => formatRate(r.onBasePercentage) },
];
