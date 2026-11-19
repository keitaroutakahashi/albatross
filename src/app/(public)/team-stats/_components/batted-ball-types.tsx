import { SubSectionGroup } from "@/app/_components/ui/sub-section-group";
import type { BattedBallTypeSummary } from "@/app/_utils/stats/batted-ball";
import { StackedBar } from "@/app/(public)/team-stats/_components/stacked-bar";

type Props = {
  summary: BattedBallTypeSummary;
};

/** アウトになった打球の種別。ゴロばかりなら長打が出にくく、フライが多ければ外野に捕られている */
export const BattedBallTypes = ({ summary }: Props) => (
  <SubSectionGroup title="アウトの打球種別">
    {summary.total === 0 ? (
      <p className="text-sm text-gray-500">打球種別の記録がありません</p>
    ) : (
      <div className="flex flex-col gap-y-2">
        <StackedBar
          ariaLabel={`アウトの打球種別: ゴロ ${summary.counts.ground}、フライ ${summary.counts.fly}、ライナー ${summary.counts.line}`}
          segments={[
            {
              key: "ground",
              label: "ゴロ",
              value: summary.counts.ground,
              className: "bg-amber-600",
            },
            {
              key: "fly",
              label: "フライ",
              value: summary.counts.fly,
              className: "bg-sky-400",
            },
            {
              key: "line",
              label: "ライナー",
              value: summary.counts.line,
              className: "bg-violet-500",
            },
          ]}
        />
        <p className="text-xs text-gray-500">
          併殺打はゴロ、犠飛はフライとして数えます。安打には打球種別の記録がないため、アウトだけが対象です
        </p>
      </div>
    )}
  </SubSectionGroup>
);
