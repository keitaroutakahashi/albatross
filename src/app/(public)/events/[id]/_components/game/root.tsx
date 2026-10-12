import type { GameDetail } from "@/app/_features/games/api/get-games";
import { AIAnalysis } from "@/app/(public)/games/[id]/_components/ai-analysis";
import { BenchLineup } from "@/app/(public)/games/[id]/_components/bench-lineup";
import { GameHeader } from "@/app/(public)/games/[id]/_components/game-header";
import { GameInfo } from "@/app/(public)/games/[id]/_components/game-info";
import { GameOverview } from "@/app/(public)/games/[id]/_components/game-overview";
import { GameResults } from "@/app/(public)/games/[id]/_components/game-results";
import { GameStats } from "@/app/(public)/games/[id]/_components/game-stats";
import { GameSummary } from "@/app/(public)/games/[id]/_components/game-summary";
import { ScoreBoard } from "@/app/(public)/games/[id]/_components/score-board";
import { StartingLineup } from "@/app/(public)/games/[id]/_components/starting-lineup";

type Props = {
  game: GameDetail;
};

export const Root = async ({ game }: Props) => {
  return (
    <div>
      <GameHeader game={game} />
      <div className="mt-4" />
      <GameOverview game={game} />
      <div className="@content:max-w-5xl @content:mx-auto px-3 @content:px-5 py-6 flex flex-col @content:gap-y-14 gap-y-10">
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
