import type { GameWithRelations } from "@/app/_features/games/api/getGames";
import { getGameById } from "@/app/(public)/games/_dummy/data";
import { GameHeader } from "@/app/(public)/games/[id]/_components/gameHeader";
import { GameOverview } from "@/app/(public)/games/[id]/_components/gameOverview";
import { GamePitchers } from "@/app/(public)/games/[id]/_components/gamePitchers";
import { GameResults } from "@/app/(public)/games/[id]/_components/gameResults";
import { GameStartingLineup } from "@/app/(public)/games/[id]/_components/gameStartingLineup";
import { GameStats } from "@/app/(public)/games/[id]/_components/gameStats";
import { GameSummary } from "@/app/(public)/games/[id]/_components/gameSummary";
import { ScoreBoard } from "@/app/(public)/games/[id]/_components/scoreBoard";

type Props = {
  game: GameWithRelations;
};

export const Root = async ({ game }: Props) => {
  return (
    <div>
      <GameHeader game={game} />
      <div className="mt-4"></div>
      <GameOverview game={game} />
      <div className="md:max-w-4xl md:mx-auto px-5 py-6">
        <ScoreBoard game={game} />
        {/* <GameSummary game={game} /> */}
        {/* <GamePitchers game={game} /> */}
        {/* <GameStartingLineup game={game} /> */}
        {/* <GameResults game={game} /> */}
        {/* <GameStats game={game} /> */}
      </div>
    </div>
  );
};
