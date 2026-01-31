import type { GameWithRelations } from "@/app/_features/games/api/getGames";
import { GameCardScoreInfo } from "@/app/_features/games/components/gameCardScoreInfo";
import { GameCardTeamInfo } from "@/app/_features/games/components/gameCardTeamInfo";

type Props = {
  game: GameWithRelations;
};

export const GameCardBody = ({ game }: Props) => {
  console.log("game", game);

  return (
    <div className="grid grid-cols-3 p-3 md:px-10 md:flex-1">
      <GameCardTeamInfo
        isHome={game.isFirstBatting}
        teamName={game.isFirstBatting ? "Albatross" : game.opponent.name}
        pitcher={""}
      />

      <GameCardScoreInfo game={game} />

      <GameCardTeamInfo
        isHome={!game.isFirstBatting}
        teamName={!game.isFirstBatting ? "Albatross" : game.opponent.name}
        pitcher={""}
      />
    </div>
  );
};
