import { type ColumnDef, DataTable } from "@/app/_components/ui/data-table";
import { SubSectionGroup } from "@/app/_components/ui/sub-section-group";
import { atBatResultFullLabel } from "@/app/_constants/labels";
import type { AtBatResultCount } from "@/app/_utils/stats/at-bat-breakdown";
import { formatPercent } from "@/app/_utils/stats/rate";
import { HeaderWithHint } from "@/app/(public)/team-stats/_components/header-with-hint";

type Props = {
  title: string;
  rows: AtBatResultCount[];
  /** 「割合」が何に占める割合かの説明 */
  rateHint: string;
  /** 該当する打席がないときの表示 */
  emptyText: string;
};

/** 打席結果ごとの回数と割合の表。打席全体・アウト・得点圏など、集計対象を切り替えて使う */
export const AtBatResults = ({ title, rows, rateHint, emptyText }: Props) => {
  const columns: ColumnDef<AtBatResultCount>[] = [
    {
      key: "result",
      header: "結果",
      align: "left",
      cell: (r) => atBatResultFullLabel[r.result],
    },
    { key: "count", header: "回数", cell: (r) => r.count },
    {
      key: "rate",
      header: <HeaderWithHint label="割合" hint={rateHint} />,
      cell: (r) => formatPercent(r.rate),
    },
  ];

  return (
    <SubSectionGroup title={title}>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-500">{emptyText}</p>
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          keyExtractor={(r) => r.result}
          sticky={{ count: 1, offsets: ["left-0"] }}
        />
      )}
    </SubSectionGroup>
  );
};
