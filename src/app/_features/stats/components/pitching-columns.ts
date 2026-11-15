import type { ColumnDef } from "@/app/_components/ui/data-table";
import { formatEra } from "@/app/_utils/stats/era";
import { formatInnings } from "@/app/_utils/stats/innings";
import type { PitchingSummary } from "@/app/_utils/stats/pitching-summary";

/** 通算・グラウンド別など、切り口ごとの投球成績表で共通の列（切り口の列は含まない） */
export const pitchingColumns = <
  T extends PitchingSummary,
>(): ColumnDef<T>[] => [
  { key: "games", header: "登板", cell: (r) => r.games },
  { key: "starts", header: "先発", cell: (r) => r.starts },
  { key: "wins", header: "勝", cell: (r) => r.wins },
  { key: "losses", header: "敗", cell: (r) => r.losses },
  { key: "ip", header: "投球回", cell: (r) => formatInnings(r.outs) },
  {
    key: "pitches",
    header: "球数",
    cell: (r) => r.pitchCount ?? "-",
  },
  { key: "h", header: "被安打", cell: (r) => r.hitsAllowed },
  { key: "hr", header: "被本塁打", cell: (r) => r.homeRunsAllowed },
  { key: "so", header: "奪三振", cell: (r) => r.strikeouts },
  { key: "bb", header: "与四球", cell: (r) => r.walks },
  { key: "hbp", header: "与死球", cell: (r) => r.hitByPitches },
  { key: "r", header: "失点", cell: (r) => r.runs },
  { key: "er", header: "自責点", cell: (r) => r.earnedRuns },
  { key: "era", header: "防御率", cell: (r) => formatEra(r.era) },
  {
    key: "whip",
    header: "WHIP",
    cell: (r) => (r.whip === null ? "-" : r.whip.toFixed(2)),
  },
];
