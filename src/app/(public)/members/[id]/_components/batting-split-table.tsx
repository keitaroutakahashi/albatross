import { type ColumnDef, DataTable } from "@/app/_components/ui/data-table";
import { SubSectionGroup } from "@/app/_components/ui/sub-section-group";
import type { BattingSplitRow } from "@/app/_features/members/api/get-member-stats";
import { battingSplitColumns } from "@/app/(public)/members/[id]/_components/batting-split-columns";

type Props<T extends BattingSplitRow> = {
  title: string;
  /** 切り口の列（先頭列）の見出し */
  labelHeader: string;
  getLabel: (row: T) => string;
  getKey: (row: T) => string;
  rows: T[];
  /** 「試合」列が打席数と同じ値になる切り口では true にして列を省く */
  hideGames?: boolean;
};

/** グラウンド別・月別・打順別など、切り口ごとの打撃成績表 */
export const BattingSplitTable = <T extends BattingSplitRow>({
  title,
  labelHeader,
  getLabel,
  getKey,
  rows,
  hideGames = false,
}: Props<T>) => {
  const columns: ColumnDef<T>[] = [
    { key: "label", header: labelHeader, align: "left", cell: getLabel },
    ...battingSplitColumns<T>().filter(
      (column) => !(hideGames && column.key === "games"),
    ),
  ];

  return (
    <SubSectionGroup title={title}>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-500">打席の記録がありません</p>
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          keyExtractor={getKey}
          sticky={{ count: 1, offsets: ["left-0"] }}
        />
      )}
    </SubSectionGroup>
  );
};
