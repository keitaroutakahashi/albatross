import { type ColumnDef, DataTable } from "@/app/_components/ui/data-table";
import { SubSectionGroup } from "@/app/_components/ui/sub-section-group";
import type { BattingSummary } from "@/app/_utils/stats/batting-summary";
import { formatPercent, formatRate } from "@/app/_utils/stats/rate";
import { HeaderWithHint } from "@/app/(public)/team-stats/_components/header-with-hint";

type Props = {
  batting: BattingSummary;
};

const columns: ColumnDef<BattingSummary>[] = [
  {
    key: "iso",
    header: (
      <HeaderWithHint
        label="ISO"
        hint="長打率 − 打率。単打を除いた、長打力の目安です。"
      />
    ),
    cell: (r) => formatRate(r.iso),
  },
  {
    key: "babip",
    header: (
      <HeaderWithHint
        label="BABIP"
        hint="本塁打を除くインプレー打球が安打になった割合です。運の影響も受けます。"
      />
    ),
    cell: (r) => formatRate(r.babip),
  },
  {
    key: "bbRate",
    header: (
      <HeaderWithHint
        label="四死球率"
        hint="打席のうち、四死球で出塁した割合です。"
      />
    ),
    cell: (r) => formatPercent(r.walkRate),
  },
  {
    key: "kRate",
    header: (
      <HeaderWithHint
        label="三振率"
        hint="打席のうち、三振に終わった割合です。"
      />
    ),
    cell: (r) => formatPercent(r.strikeoutRate),
  },
  {
    key: "bbk",
    header: (
      <HeaderWithHint
        label="BB/K"
        hint="四死球 ÷ 三振。大きいほど、選球眼がよい傾向です。"
      />
    ),
    cell: (r) =>
      r.walkStrikeoutRatio === null ? "-" : r.walkStrikeoutRatio.toFixed(2),
  },
  { key: "gdp", header: "併殺打", cell: (r) => r.doublePlays },
  {
    key: "rispRbi",
    header: (
      <HeaderWithHint
        label="得点圏打点"
        hint="二塁または三塁に走者がいる場面で挙げた打点です。"
      />
    ),
    cell: (r) => r.scoringPositionRbi,
  },
];

/** 長打力・選球眼・併殺など、チームの打撃の傾向を見る指標 */
export const BattingIndicators = ({ batting }: Props) => (
  <SubSectionGroup title="打者指標">
    <DataTable
      columns={columns}
      data={[batting]}
      keyExtractor={() => "total"}
    />
  </SubSectionGroup>
);
