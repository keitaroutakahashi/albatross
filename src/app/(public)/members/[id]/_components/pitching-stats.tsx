import { DataTable } from "@/app/_components/ui/data-table";
import { SubSectionGroup } from "@/app/_components/ui/sub-section-group";
import type { PitchingSummary } from "@/app/_utils/stats/pitching-summary";
import { pitchingColumns } from "@/app/(public)/members/[id]/_components/pitching-columns";

type Props = {
  pitching: PitchingSummary;
};

const columns = pitchingColumns<PitchingSummary>();

/** 通算（選択年度）の投球成績 */
export const PitchingStats = ({ pitching }: Props) => (
  <SubSectionGroup title="投球成績">
    <DataTable
      columns={columns}
      data={[pitching]}
      keyExtractor={() => "total"}
    />
  </SubSectionGroup>
);
