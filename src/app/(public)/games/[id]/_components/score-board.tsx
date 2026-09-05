import type { GameDetail } from "@/app/_features/games/api/get-games";
import { ScoreBoardBody } from "@/app/(public)/games/[id]/_components/score-board-body";
import { ScoreBoardHeader } from "@/app/(public)/games/[id]/_components/score-board-header";

type Props = {
  game: GameDetail;
};

export const ScoreBoard = ({ game }: Props) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed border">
        <colgroup>
          <col className="w-10 @content:w-20" />
        </colgroup>
        <ScoreBoardHeader game={game} />
        <ScoreBoardBody game={game} />
      </table>

      {!!game.teamForfeitedRuns && (
        <p className="text-xs mt-2 text-gray-500">
          ※ 自チームの得点には献上点 {game.teamForfeitedRuns} 点を含む
        </p>
      )}
      {!!game.opponentForfeitedRuns && (
        <p className="text-xs mt-2 text-gray-500">
          ※ 相手チームの得点には献上点 {game.opponentForfeitedRuns} 点を含む
        </p>
      )}
    </div>
  );
};
