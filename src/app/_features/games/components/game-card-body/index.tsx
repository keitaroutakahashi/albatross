import type { GameWithRelations } from "@/app/_features/games/api/get-games";
import { GameCardScoreInfo } from "@/app/_features/games/components/game-card-score-info";
import { GameCardTeamInfo } from "@/app/_features/games/components/game-card-team-info";

type Props = {
  game: GameWithRelations;
};

export const GameCardBody = ({ game }: Props) => {
  if (game.isFirstBatting === null) {
    return (
      <div className="grid grid-cols-3 gap-x-2 p-3 @content:px-10 @content:flex-1">
        <div />
        <GameCardScoreInfo game={game} />
        <div />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-3 gap-x-2 p-3 @content:px-10 @content:flex-1">
      <GameCardTeamInfo
        isHome={game.isFirstBatting}
        teamName={game.isFirstBatting ? "Albatross" : game?.opponent?.name}
        pitcher={""}
      />

      <GameCardScoreInfo game={game} />

      <GameCardTeamInfo
        isHome={!game.isFirstBatting}
        teamName={!game.isFirstBatting ? "Albatross" : game?.opponent?.name}
        pitcher={""}
      />
    </div>
  );
};
