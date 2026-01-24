import type { GameData } from "@/app/(public)/games/_dummy/data";

type Props = {
  game: GameData;
};

export const GameStats = ({ game }: Props) => {
  const { duration, participants } = game;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold mb-3 border-b-2 border-gray-800 pb-2">
        試合情報
      </h2>
      <div className="bg-gray-50 p-4 rounded">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">試合時間</span>
            <p className="font-medium">{duration || "-"}</p>
          </div>
          <div>
            <span className="text-gray-500">参加人数</span>
            <p className="font-medium">
              {participants ? `${participants}人` : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
