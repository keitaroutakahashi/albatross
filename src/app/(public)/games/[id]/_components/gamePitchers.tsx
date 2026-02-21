import type { GameDetail } from "@/app/_features/games/api/getGames";

type Props = {
  game: GameDetail;
};

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

export const GamePitchers = ({ game }: Props) => {
  const pitchers = game.gameMembers.filter((gm) => gm.pitchingResult != null);

  if (pitchers.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="text-sm @content:text-base border-collapse w-full">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="p-2 text-left whitespace-nowrap sticky left-0 bg-gray-800">
              投手名
            </th>
            <th className="p-2 text-center whitespace-nowrap w-10">勝敗</th>
            <th className="p-2 text-center whitespace-nowrap w-14">回</th>
            <th className="p-2 text-center whitespace-nowrap w-10">被安</th>
            <th className="p-2 text-center whitespace-nowrap w-10">被本</th>
            <th className="p-2 text-center whitespace-nowrap w-10">奪三</th>
            <th className="p-2 text-center whitespace-nowrap w-10">四球</th>
            <th className="p-2 text-center whitespace-nowrap w-10">死球</th>
            <th className="p-2 text-center whitespace-nowrap w-10">失点</th>
            <th className="p-2 text-center whitespace-nowrap w-10">自責</th>
          </tr>
        </thead>
        <tbody>
          {pitchers.map((gm) => {
            const pr = gm.pitchingResult;
            if (!pr) return null;
            return (
              <tr key={gm.id} className="border-b border-gray-200">
                <td className="p-2 whitespace-nowrap font-medium sticky left-0 bg-white">
                  {gm.member.name}
                </td>
                <td className="p-2 text-center">
                  {decisionLabel(pr.decision)}
                </td>
                <td className="p-2 text-center">
                  {formatInningsPitched(pr.inningsPitched, pr.partialOuts)}
                </td>
                <td className="p-2 text-center">{pr.hitsAllowed}</td>
                <td className="p-2 text-center">{pr.homeRunsAllowed}</td>
                <td className="p-2 text-center">{pr.strikeouts}</td>
                <td className="p-2 text-center">{pr.walks}</td>
                <td className="p-2 text-center">{pr.hitByPitches}</td>
                <td className="p-2 text-center">{pr.runs}</td>
                <td className="p-2 text-center">{pr.earnedRuns}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
