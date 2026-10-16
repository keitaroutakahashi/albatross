import type { GameWithRelations } from "@/app/_features/games/api/get-games";
import { GameCardScoreInfo } from "@/app/_features/games/components/game-card-score-info";
import { GameCardTeamInfo } from "@/app/_features/games/components/game-card-team-info";

type Props = {
  game: GameWithRelations;
};

export const GameCardBody = ({ game }: Props) => {
  const opponentName = game.opponent?.name;

  if (game.isFirstBatting === null && !opponentName) {
    return (
      <div className="grid grid-cols-3 gap-x-2 p-3 @content:px-10 @content:flex-1">
        <div />
        <GameCardScoreInfo game={game} />
        <div />
      </div>
    );
  }

  // 先攻後攻が未定のときは、自チームを左に置く
  const isFirstBatting = game.isFirstBatting ?? true;

  return (
    <div className="grid grid-cols-3 gap-x-2 p-3 @content:px-10 @content:flex-1">
      <GameCardTeamInfo
        isHome={isFirstBatting}
        teamName={isFirstBatting ? "Albatross" : opponentName}
        pitcher={""}
      />

      <GameCardScoreInfo game={game} />

      <GameCardTeamInfo
        isHome={!isFirstBatting}
        teamName={!isFirstBatting ? "Albatross" : opponentName}
        pitcher={""}
      />
    </div>
  );
};
