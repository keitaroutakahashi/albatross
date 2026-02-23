import type { ColumnDef } from "@/app/_components/ui/data-table";
import { DataTable } from "@/app/_components/ui/data-table";
import type { GameDetail } from "@/app/_features/games/api/get-games";

type Props = {
  game: GameDetail;
};

type PitcherRow = GameDetail["gameMembers"][number];

/** 投球回を "5 1/3" 形式でフォーマット */
const formatInningsPitched = (
  inningsPitched: number,
  partialOuts: number | null,
): string => {
  if (partialOuts == null) return `${inningsPitched}`;
  return `${inningsPitched} ${partialOuts}/3`;
};

/** 勝敗を記号で表示 */
const decisionLabel = (decision: string | null): string => {
  if (decision === "win") return "○";
  if (decision === "loss") return "●";
  return "";
};

const columns: ColumnDef<PitcherRow>[] = [
  {
    key: "name",
    header: "投手名",
    cell: (row) => row.member.name,
    align: "left",
    cellClassName: "font-medium",
  },
  {
    key: "decision",
    header: "勝敗",
    cell: (row) => decisionLabel(row.pitchingResult?.decision ?? null),
    headerClassName: "w-10",
  },
  {
    key: "innings",
    header: "回",
    cell: (row) => {
      const pr = row.pitchingResult;
      return pr ? formatInningsPitched(pr.inningsPitched, pr.partialOuts) : "";
    },
    headerClassName: "w-16",
  },
  {
    key: "hits",
    header: "被安",
    cell: (row) => row.pitchingResult?.hitsAllowed ?? "",
    headerClassName: "w-10",
  },
  {
    key: "homeRuns",
    header: "被本",
    cell: (row) => row.pitchingResult?.homeRunsAllowed ?? "",
    headerClassName: "w-10",
  },
  {
    key: "strikeouts",
    header: "奪三",
    cell: (row) => row.pitchingResult?.strikeouts ?? "",
    headerClassName: "w-10",
  },
  {
    key: "walks",
    header: "四球",
    cell: (row) => row.pitchingResult?.walks ?? "",
    headerClassName: "w-10",
  },
  {
    key: "hitByPitches",
    header: "死球",
    cell: (row) => row.pitchingResult?.hitByPitches ?? "",
    headerClassName: "w-10",
  },
  {
    key: "runs",
    header: "失点",
    cell: (row) => row.pitchingResult?.runs ?? "",
    headerClassName: "w-10",
  },
  {
    key: "earnedRuns",
    header: "自責",
    cell: (row) => row.pitchingResult?.earnedRuns ?? "",
    headerClassName: "w-10",
  },
];

export const GamePitchers = ({ game }: Props) => {
  const pitchers = game.gameMembers.filter((gm) => gm.pitchingResult != null);

  if (pitchers.length === 0) {
    return null;
  }

  return (
    <DataTable
      columns={columns}
      data={pitchers}
      keyExtractor={(row) => String(row.id)}
      sticky={{ count: 1, offsets: ["left-0"] }}
      className="mt-4"
    />
  );
};
