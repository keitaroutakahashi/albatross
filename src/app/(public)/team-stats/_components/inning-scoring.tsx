import { type ColumnDef, DataTable } from "@/app/_components/ui/data-table";
import { SubSectionGroup } from "@/app/_components/ui/sub-section-group";
import type { InningScoringRow } from "@/app/_utils/stats/inning-scoring";

type Props = {
  rows: InningScoringRow[];
  /** scored: 回別得点（打撃）, allowed: 回別失点（投手） */
  mode: "scored" | "allowed";
};

const MODE_TITLE = {
  scored: "回別得点",
  allowed: "回別失点",
} as const;

/** 回ごとの 1 試合あたりの得点または失点を表示する（イニング得点の記録がある試合のみ） */
export const InningScoring = ({ rows, mode }: Props) => {
  const runsOf = (row: InningScoringRow) =>
    mode === "scored" ? row.runsScored : row.runsAllowed;

  const columns: ColumnDef<InningScoringRow[]>[] = [
    { key: "label", header: "回", align: "left", cell: () => "1 試合平均" },
    ...rows.map(
      (row, i): ColumnDef<InningScoringRow[]> => ({
        key: String(row.inningNumber),
        header: row.inningNumber,
        cell: (innings) =>
          innings[i].games > 0
            ? (runsOf(innings[i]) / innings[i].games).toFixed(2)
            : "-",
      }),
    ),
  ];

  return (
    <SubSectionGroup title={MODE_TITLE[mode]}>
      {rows.every((row) => row.games === 0) ? (
        <p className="text-sm text-gray-500">イニング得点の記録がありません</p>
      ) : (
        <DataTable
          columns={columns}
          data={[rows]}
          keyExtractor={() => "average"}
          sticky={{ count: 1, offsets: ["left-0"] }}
        />
      )}
    </SubSectionGroup>
  );
};
