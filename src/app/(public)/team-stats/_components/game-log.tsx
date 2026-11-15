import Link from "next/link";
import { type ColumnDef, DataTable } from "@/app/_components/ui/data-table";
import { SubSectionGroup } from "@/app/_components/ui/sub-section-group";
import { gameResultLabel } from "@/app/_constants/labels";
import type { GameLogRow } from "@/app/_features/team/api/get-team-stats";

type Props = {
  rows: GameLogRow[];
};

const columns: ColumnDef<GameLogRow>[] = [
  {
    key: "date",
    header: "日付",
    align: "left",
    cell: (r) => (
      <Link href={`/events/${r.eventId}`} className="underline">
        {r.date}
      </Link>
    ),
  },
  {
    key: "opponent",
    header: "対戦相手",
    align: "left",
    cell: (r) => r.opponentName ?? "-",
  },
  {
    key: "result",
    header: "結果",
    cell: (r) => (r.result ? gameResultLabel[r.result] : "-"),
  },
  {
    key: "score",
    header: "スコア",
    cell: (r) => `${r.teamScore ?? "-"} - ${r.opponentScore ?? "-"}`,
  },
  { key: "hits", header: "安打", cell: (r) => r.teamHits ?? "-" },
  { key: "errors", header: "失策", cell: (r) => r.teamErrors ?? "-" },
  {
    key: "starter",
    header: "先発",
    align: "left",
    cell: (r) =>
      r.starter ? (
        <Link href={`/members/${r.starter.id}`} className="underline">
          {r.starter.name}
        </Link>
      ) : (
        "-"
      ),
  },
];

/** 試合ごとの結果（新しい順） */
export const GameLog = ({ rows }: Props) => (
  <SubSectionGroup title="試合別の記録">
    {rows.length === 0 ? (
      <p className="text-sm text-gray-500">試合の記録がありません</p>
    ) : (
      <DataTable
        columns={columns}
        data={rows}
        keyExtractor={(r) => String(r.eventId)}
        sticky={{ count: 1, offsets: ["left-0"] }}
      />
    )}
  </SubSectionGroup>
);
