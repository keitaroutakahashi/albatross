import type { GameData } from "@/app/(public)/games/_dummy/data";

type Props = {
  game: GameData;
};

const getResultStyles = (result: GameData["result"]) => {
  switch (result) {
    case "win":
      return {
        badge: "bg-green-600",
        text: "勝",
        row: "bg-green-50",
      };
    case "lose":
      return {
        badge: "bg-red-600",
        text: "負",
        row: "bg-red-50",
      };
    case "draw":
      return {
        badge: "bg-gray-500",
        text: "分",
        row: "bg-gray-50",
      };
  }
};

export const ScoreBoard = ({ game }: Props) => {
  const resultStyles = getResultStyles(game.result);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[500px] border-collapse">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="p-3 text-left font-bold w-32">チーム</th>
            {game.innings.map((inning) => (
              <th
                key={inning.inning}
                className="p-3 text-center font-bold w-10"
              >
                {inning.inning}
              </th>
            ))}
            <th className="p-3 text-center font-bold w-16 bg-gray-900">計</th>
          </tr>
        </thead>
        <tbody>
          {/* 先攻チーム（相手チーム or 自チーム） */}
          <tr className={game.isHome ? "bg-white" : resultStyles.row}>
            <td className="p-3 border-b border-gray-200 font-bold">
              <div className="flex items-center gap-2">
                {!game.isHome && (
                  <span
                    className={`${resultStyles.badge} text-white text-xs rounded px-1.5 py-0.5 font-bold`}
                  >
                    {resultStyles.text}
                  </span>
                )}
                {game.isHome ? game.opposingTeam : "Albatross"}
              </div>
            </td>
            {game.innings.map((inning) => (
              <td
                key={inning.inning}
                className="p-3 text-center border-b border-gray-200 font-mono"
              >
                {game.isHome ? inning.opponentScore : inning.ourScore}
              </td>
            ))}
            <td className="p-3 text-center border-b border-gray-200 font-bold text-lg bg-gray-100">
              {game.isHome ? game.opposingTeamScore : game.teamScore}
            </td>
          </tr>
          {/* 後攻チーム（自チーム or 相手チーム） */}
          <tr className={game.isHome ? resultStyles.row : "bg-white"}>
            <td className="p-3 border-b border-gray-200 font-bold">
              <div className="flex items-center gap-2">
                {game.isHome && (
                  <span
                    className={`${resultStyles.badge} text-white text-xs rounded px-1.5 py-0.5 font-bold`}
                  >
                    {resultStyles.text}
                  </span>
                )}
                {game.isHome ? "Albatross" : game.opposingTeam}
              </div>
            </td>
            {game.innings.map((inning) => (
              <td
                key={inning.inning}
                className="p-3 text-center border-b border-gray-200 font-mono"
              >
                {game.isHome ? inning.ourScore : inning.opponentScore}
              </td>
            ))}
            <td className="p-3 text-center border-b border-gray-200 font-bold text-lg bg-gray-100">
              {game.isHome ? game.teamScore : game.opposingTeamScore}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
