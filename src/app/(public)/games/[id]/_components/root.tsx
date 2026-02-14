import type { GameWithRelations } from "@/app/_features/games/api/getGames";
import { getGameById } from "@/app/(public)/games/_dummy/data";
import { AIAnalysis } from "@/app/(public)/games/[id]/_components/aiAnalysis";
import { GameHeader } from "@/app/(public)/games/[id]/_components/gameHeader";
import { GameInfo } from "@/app/(public)/games/[id]/_components/gameInfo";
import { GameOverview } from "@/app/(public)/games/[id]/_components/gameOverview";
import { GamePitchers } from "@/app/(public)/games/[id]/_components/gamePitchers";
import { GameResults } from "@/app/(public)/games/[id]/_components/gameResults";
import { GameStats } from "@/app/(public)/games/[id]/_components/gameStats";
import { GameSummary } from "@/app/(public)/games/[id]/_components/gameSummary";
import { Lineup } from "@/app/(public)/games/[id]/_components/lineup";
import { ScoreBoard } from "@/app/(public)/games/[id]/_components/scoreBoard";

type Props = {
  game: GameWithRelations;
};

export const Root = async ({ game }: Props) => {
  console.log("game", game.gameMembers);
  return (
    <div>
      <GameHeader game={game} />
      <div className="mt-4"></div>
      <GameOverview game={game} />
      <div className="md:max-w-5xl md:mx-auto px-3 md:px-5 py-6 flex flex-col md:gap-y-14 gap-y-10">
        <ScoreBoard game={game} />
        <GameInfo game={game} />
        <GameSummary game={game} />
        {/* <GamePitchers game={game} /> */}
        <Lineup
          members={game.gameMembers.filter(
            (gm) => gm.memberType === "starting",
          )}
          title="スターティングメンバー"
        />
        <Lineup
          members={game.gameMembers.filter((gm) => gm.memberType === "bench")}
          title="ベンチ入りメンバー"
        />
        <GameResults game={game} />
        <GameStats game={game} />
        <AIAnalysis game={game} />
      </div>
    </div>
  );
};
