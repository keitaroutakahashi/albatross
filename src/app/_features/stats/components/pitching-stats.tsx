import { DataTable } from "@/app/_components/ui/data-table";
import { SubSectionGroup } from "@/app/_components/ui/sub-section-group";
import { pitchingColumns } from "@/app/_features/stats/components/pitching-columns";
import type { PitchingSummary } from "@/app/_utils/stats/pitching-summary";

type Props = {
  pitching: PitchingSummary;
  /** 表の下に添える補足 */
  note?: string;
};

const columns = pitchingColumns<PitchingSummary>();

/** 通算（選択年度）の投球成績 */
export const PitchingStats = ({ pitching, note }: Props) => (
  <SubSectionGroup title="投球成績">
    <DataTable
      columns={columns}
      data={[pitching]}
      keyExtractor={() => "total"}
    />
    {note && <p className="mt-2 text-xs text-gray-500">{note}</p>}
  </SubSectionGroup>
);
