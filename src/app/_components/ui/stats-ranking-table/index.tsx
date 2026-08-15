import { clsx } from "clsx";
import Link from "next/link";
import { type ColumnDef, DataTable } from "@/app/_components/ui/data-table";
import type { MemberRanking } from "@/app/_features/members/utils/ranking";

type Props = {
  rows: MemberRanking[];
  /** 値カラムのヘッダー（"打率" 等） */
  valueLabel: string;
  /** 値の表示フォーマット */
  formatValue: (value: number) => string;
};

/**
 * 打者・投手成績ページ共通のランキングテーブル。
 * 順位・選手名・選択中の指標値の 3 列を表示する。
 */
export const StatsRankingTable = ({ rows, valueLabel, formatValue }: Props) => {
  if (rows.length === 0) {
    return <p className="py-8 text-center text-sm text-gray-500">記録なし</p>;
  }

  const columns: ColumnDef<MemberRanking>[] = [
    {
      key: "rank",
      header: "順位",
      align: "center",
      headerClassName: "w-12",
      cellClassName: "w-12",
      cell: (row) => (
        <span
          className={clsx(
            "font-(family-name:--font-roboto) font-bold tabular-nums",
            { "text-red-400": row.rank === 1 },
          )}
        >
          {row.rank}
        </span>
      ),
    },
    {
      key: "name",
      header: <span className="pl-3">選手名</span>,
      align: "left",
      cell: (row) => (
        <Link
          href={`/members/${row.memberId}`}
          className="pl-3 font-bold underline underline-offset-2"
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: "value",
      header: valueLabel,
      align: "center",
      headerClassName: "w-24",
      cellClassName: "w-24",
      cell: (row) => (
        <span
          className={clsx("font-(family-name:--font-roboto) tabular-nums", {
            "text-red-400": row.rank === 1,
            "font-bold": row.rank <= 3,
          })}
        >
          {formatValue(row.value)}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={rows}
      keyExtractor={(row) => String(row.memberId)}
    />
  );
};
