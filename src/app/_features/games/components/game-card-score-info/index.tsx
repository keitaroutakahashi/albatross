import type { GameWithRelations } from "@/app/_features/games/api/get-games";

type Props = {
  game: GameWithRelations;
};

const getResultBadge = (result: GameWithRelations["result"]) => {
  switch (result) {
    case "win":
      return { text: "勝", className: "bg-secondary" };
    case "lose":
      return { text: "負", className: "bg-primary" };
    case "draw":
      return { text: "分", className: "bg-gray-400" };
    default:
      return { text: "", className: "" };
  }
};

export const GameCardScoreInfo = ({ game }: Props) => {
  const resultBadge = getResultBadge(game.result);

  return (
    <div className="flex flex-col items-center justify-center gap-y-2 @content:gap-y-3">
      <p className="text-xs @content:text-sm font-bold text-center">
        {game.ground?.name}
      </p>

      {game.status !== "scheduled" && (
        <>
          <div className="">
            {game.status !== "canceled" && (
              <span className="text-4xl font-bold">
                {game.isFirstBatting ? game.teamScore : game.opponentScore}
              </span>
            )}
            <span className="text-4xl font-bold mx-2">-</span>
            {game.status !== "canceled" && (
              <span className="text-4xl font-bold">
                {game.isFirstBatting ? game.opponentScore : game.teamScore}
              </span>
            )}
          </div>

          <div className="flex items-center">
            {game.status === "canceled" ? (
              <span className="text-xs font-bold text-gray-500">中止</span>
            ) : (
              <span
                className={`${resultBadge.className} text-white text-xs rounded size-5 font-bold flex items-center justify-center`}
              >
                {resultBadge.text}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};
