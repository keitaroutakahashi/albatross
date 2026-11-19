import { type ColumnDef, DataTable } from "@/app/_components/ui/data-table";
import { SubSectionGroup } from "@/app/_components/ui/sub-section-group";
import { atBatResultFullLabel } from "@/app/_constants/labels";
import type { AtBatResultCount } from "@/app/_utils/stats/at-bat-breakdown";
import { formatPercent } from "@/app/_utils/stats/rate";
import { HeaderWithHint } from "@/app/(public)/team-stats/_components/header-with-hint";
import { StackedBar } from "@/app/(public)/team-stats/_components/stacked-bar";
import type { AtBatResult } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  rows: AtBatResultCount[];
  /** 「割合」が何に占める割合かの説明 */
  rateHint: string;
  /** 該当する打席がないときの表示 */
  emptyText: string;
};

/** 安打は赤、四死球は黄、アウトは青系で、結果ごとに濃さや色味を変える */
const RESULT_COLOR: Record<AtBatResult, string> = {
  single: "bg-rose-300",
  double: "bg-rose-400",
  triple: "bg-rose-500",
  homeRun: "bg-rose-700",
  walk: "bg-amber-300",
  hitByPitch: "bg-amber-500",
  strikeout: "bg-slate-600",
  groundOut: "bg-blue-300",
  flyOut: "bg-blue-400",
  lineOut: "bg-blue-600",
  sacrificeHit: "bg-teal-300",
  sacrificeFly: "bg-teal-500",
  fieldersChoice: "bg-gray-300",
  doublePlay: "bg-indigo-500",
  error: "bg-gray-500",
};

/** 打席結果ごとの回数と割合を、横棒と表で見る。打席全体・アウト・得点圏など、集計対象を切り替えて使う */
export const AtBatResults = ({ title, rows, rateHint, emptyText }: Props) => {
  const columns: ColumnDef<AtBatResultCount>[] = [
    {
      key: "result",
      header: "結果",
      align: "left",
      cell: (r) => (
        <span className="inline-flex items-center gap-1.5">
          <span
            className={cn(
              "size-2.5 shrink-0 rounded-sm",
              RESULT_COLOR[r.result],
            )}
            aria-hidden="true"
          />
          {atBatResultFullLabel[r.result]}
        </span>
      ),
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
        <div className="flex flex-col gap-y-3">
          <StackedBar
            legend={false}
            ariaLabel={`${title}: ${rows
              .map((r) => `${atBatResultFullLabel[r.result]} ${r.count}`)
              .join("、")}`}
            segments={rows.map((r) => ({
              key: r.result,
              label: atBatResultFullLabel[r.result],
              value: r.count,
              className: RESULT_COLOR[r.result],
            }))}
          />
          <DataTable
            columns={columns}
            data={rows}
            keyExtractor={(r) => r.result}
            sticky={{ count: 1, offsets: ["left-0"] }}
          />
        </div>
      )}
    </SubSectionGroup>
  );
};
