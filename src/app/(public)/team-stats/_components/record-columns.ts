import type { ColumnDef } from "@/app/_components/ui/data-table";
import { formatRate } from "@/app/_utils/stats/rate";
import type { TeamRecord } from "@/app/_utils/stats/team-record";

/** 戦績（試合・勝・敗・分・勝率）の列。切り口の列は含まない */
export const recordColumns = <T extends TeamRecord>(): ColumnDef<T>[] => [
  { key: "games", header: "試合", cell: (r) => r.games },
  { key: "wins", header: "勝", cell: (r) => r.wins },
  { key: "losses", header: "敗", cell: (r) => r.losses },
  { key: "draws", header: "分", cell: (r) => r.draws },
  { key: "pct", header: "勝率", cell: (r) => formatRate(r.winningPercentage) },
];

/** 得失点差を "+3" のように符号つきで表示する */
export const formatRunDifferential = (value: number): string =>
  value > 0 ? `+${value}` : String(value);

/** 1 試合あたりの得点・失点を小数第 2 位まで表示する */
export const formatRunAverage = (value: number | null): string =>
  value === null ? "-" : value.toFixed(2);
