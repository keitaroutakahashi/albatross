import { Circle } from "lucide-react";
import type { ColumnDef } from "@/app/_components/ui/data-table";
import { DataTable } from "@/app/_components/ui/data-table";
import type { GameDetail } from "@/app/_features/games/api/get-games";
import { formatInningsPitched } from "@/app/_utils/stats/innings";
import { resolvePitchingDecision } from "@/app/_utils/stats/pitching-decision";

type Props = {
  game: GameDetail;
};

type PitcherRow = GameDetail["gameMembers"][number];

/** 勝敗を記号で表示 */
const decisionLabel = (decision: string | null) => {
  if (decision === "win") return <Circle size={14} />;
  if (decision === "loss") return <Circle size={14} className="fill-black" />;
  return "";
};

const columns = (gameResult: GameDetail["result"]): ColumnDef<PitcherRow>[] => [
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
    cell: (row) =>
      decisionLabel(
        resolvePitchingDecision(
          row.pitchingResult?.isResponsible ?? false,
          gameResult,
        ),
      ),
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
    key: "pitchCount",
    header: "球数",
    // 球数は任意入力のため、未入力は「-」にする
    cell: (row) => row.pitchingResult?.pitchCount ?? "-",
    headerClassName: "w-12",
  },
  {
    key: "hits",
    header: "安",
    cell: (row) => row.pitchingResult?.hitsAllowed ?? "",
    headerClassName: "w-10",
  },
  {
    key: "homeRuns",
    header: "本",
    cell: (row) => row.pitchingResult?.homeRunsAllowed ?? "",
    headerClassName: "w-10",
  },
  {
    key: "strikeouts",
    header: "三振",
    cell: (row) => row.pitchingResult?.strikeouts ?? "",
    headerClassName: "w-10",
  },
  {
    key: "walks",
    header: "四",
    cell: (row) => row.pitchingResult?.walks ?? "",
    headerClassName: "w-10",
  },
  {
    key: "hitByPitches",
    header: "死",
    cell: (row) => row.pitchingResult?.hitByPitches ?? "",
    headerClassName: "w-10",
  },
  {
    key: "runs",
    header: "失",
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
  const pitchers = game.gameMembers
    .filter((gm) => gm.pitchingResult != null)
    .sort(
      (a, b) =>
        (a.pitchingResult?.pitchingOrder ?? 0) -
        (b.pitchingResult?.pitchingOrder ?? 0),
    );

  if (pitchers.length === 0) {
    return null;
  }

  return (
    <DataTable
      columns={columns(game.result)}
      data={pitchers}
      keyExtractor={(row) => String(row.id)}
      sticky={{ count: 1, offsets: ["left-0"] }}
      className="mt-4"
    />
  );
};
