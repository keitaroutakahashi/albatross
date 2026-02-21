import type { GameDetail } from "@/app/_features/games/api/getGames";
import { ScoreBoardBody } from "@/app/(public)/games/[id]/_components/scoreBoardBody";
import { ScoreBoardHeader } from "@/app/(public)/games/[id]/_components/scoreBoardHeader";

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
    </div>
  );
};
