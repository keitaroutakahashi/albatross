import type { GameData } from "@/app/(public)/games/_dummy/data";

type Props = {
  game: GameData;
};

export const GameStartingLineup = ({ game }: Props) => {
  const { startingLineup } = game;

  if (!startingLineup || startingLineup.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold mb-3 border-b-2 border-gray-800 pb-2">
        スターティングメンバー
      </h2>
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="text-sm font-bold mb-3 text-gray-600">Albatross</h3>
        <div className="space-y-2">
          {startingLineup.map((player) => (
            <div
              key={`${player.battingOrder}-${player.name}`}
              className="flex items-center text-sm border-b border-gray-200 pb-2 last:border-b-0 last:pb-0"
            >
              <span className="w-8 font-bold text-gray-700">
                {player.battingOrder}
              </span>
              <span className="w-8 text-center text-gray-500">
                {player.position}
              </span>
              <span className="flex-1 font-medium">{player.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
