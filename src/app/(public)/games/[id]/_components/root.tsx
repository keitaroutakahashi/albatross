import type { GameDetail } from "@/app/_features/games/api/getGames";
import { AIAnalysis } from "@/app/(public)/games/[id]/_components/aiAnalysis";
import { BenchLineup } from "@/app/(public)/games/[id]/_components/benchLineup";
import { GameHeader } from "@/app/(public)/games/[id]/_components/gameHeader";
import { GameInfo } from "@/app/(public)/games/[id]/_components/gameInfo";
import { GameOverview } from "@/app/(public)/games/[id]/_components/gameOverview";
import { GameResults } from "@/app/(public)/games/[id]/_components/gameResults";
import { GameStats } from "@/app/(public)/games/[id]/_components/gameStats";
import { GameSummary } from "@/app/(public)/games/[id]/_components/gameSummary";
import { ScoreBoard } from "@/app/(public)/games/[id]/_components/scoreBoard";
import { StartingLineup } from "@/app/(public)/games/[id]/_components/startingLineup";

type Props = {
  game: GameDetail;
};

export const Root = async ({ game }: Props) => {
  return (
    <div>
      <GameHeader game={game} />
      <div className="mt-4" />
      <GameOverview game={game} />
      <div className="md:max-w-5xl md:mx-auto px-3 md:px-5 py-6 flex flex-col md:gap-y-14 gap-y-10">
        <ScoreBoard game={game} />
        <GameInfo game={game} />
        <GameSummary game={game} />
        <StartingLineup game={game} />
        <BenchLineup game={game} />
        <GameResults game={game} />
        <GameStats game={game} />
        <AIAnalysis game={game} />
      </div>
    </div>
  );
};
