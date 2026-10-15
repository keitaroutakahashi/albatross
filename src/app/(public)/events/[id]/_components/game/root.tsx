import type { GameDetail } from "@/app/_features/games/api/get-games";
import { EventNote } from "@/app/(public)/events/[id]/_components/event-note";
import { AIAnalysis } from "@/app/(public)/events/[id]/_components/game/ai-analysis";
import { BenchLineup } from "@/app/(public)/events/[id]/_components/game/bench-lineup";
import { GameHeader } from "@/app/(public)/events/[id]/_components/game/game-header";
import { GameInfo } from "@/app/(public)/events/[id]/_components/game/game-info";
import { GameOverview } from "@/app/(public)/events/[id]/_components/game/game-overview";
import { GameResults } from "@/app/(public)/events/[id]/_components/game/game-results";
import { GameStats } from "@/app/(public)/events/[id]/_components/game/game-stats";
import { GameSummary } from "@/app/(public)/events/[id]/_components/game/game-summary";
import { ScoreBoard } from "@/app/(public)/events/[id]/_components/game/score-board";
import { StartingLineup } from "@/app/(public)/events/[id]/_components/game/starting-lineup";

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
        <EventNote note={game.event.note} />
      </div>
    </div>
  );
};
