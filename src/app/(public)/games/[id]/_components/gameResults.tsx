import type { GameData } from "@/app/(public)/games/_dummy/data";

type Props = {
  game: GameData;
};

export const GameResults = ({ game }: Props) => {
  const { battingResults, pitchingResults, innings } = game;

  if (
    (!battingResults || battingResults.length === 0) &&
    (!pitchingResults || pitchingResults.length === 0)
  ) {
    return null;
  }

  const inningCount = innings.length;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold mb-3 border-b-2 border-gray-800 pb-2">
        出場成績
      </h2>

      {battingResults && battingResults.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-bold mb-2 text-gray-600">
            打撃成績（Albatross）
          </h3>
          <div className="overflow-x-auto">
            <table className="text-sm border-collapse">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="p-2 text-left whitespace-nowrap sticky left-0 bg-gray-800 z-10">
                    守備
                  </th>
                  <th className="p-2 text-left whitespace-nowrap sticky left-10 bg-gray-800 z-10">
                    選手名
                  </th>
                  <th className="p-2 text-center whitespace-nowrap">打率</th>
                  <th className="p-2 text-center whitespace-nowrap">打数</th>
                  <th className="p-2 text-center whitespace-nowrap">安打</th>
                  <th className="p-2 text-center whitespace-nowrap">打点</th>
                  <th className="p-2 text-center whitespace-nowrap">本</th>
                  <th className="p-2 text-center whitespace-nowrap">盗</th>
                  {Array.from({ length: inningCount }, (_, i) => (
                    <th
                      key={`inning-header-${i + 1}`}
                      className="p-2 text-center whitespace-nowrap bg-gray-700"
                    >
                      {i + 1}回
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {battingResults.map((player) => (
                  <tr
                    key={`${player.position}-${player.name}`}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-2 text-gray-500 whitespace-nowrap sticky left-0 bg-white z-10">
                      {player.position}
                    </td>
                    <td className="p-2 font-medium whitespace-nowrap sticky left-10 bg-white z-10">
                      {player.name}
                    </td>
                    <td className="p-2 text-center whitespace-nowrap">
                      {player.battingAverage}
                    </td>
                    <td className="p-2 text-center">{player.atBats}</td>
                    <td className="p-2 text-center">{player.hits}</td>
                    <td className="p-2 text-center">{player.rbi}</td>
                    <td className="p-2 text-center">{player.homeRuns}</td>
                    <td className="p-2 text-center">{player.stolenBases}</td>
                    {Array.from({ length: inningCount }, (_, i) => (
                      <td
                        key={`${player.name}-inning-${i + 1}`}
                        className="p-2 text-center whitespace-nowrap text-gray-600"
                      >
                        {player.inningResults[i] || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pitchingResults && pitchingResults.length > 0 && (
        <div>
          <h3 className="text-sm font-bold mb-2 text-gray-600">
            投手成績（Albatross）
          </h3>
          <div className="overflow-x-auto">
            <table className="text-sm border-collapse">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="p-2 text-left whitespace-nowrap">投手名</th>
                  <th className="p-2 text-center whitespace-nowrap">投球回</th>
                  <th className="p-2 text-center whitespace-nowrap">被安打</th>
                  <th className="p-2 text-center whitespace-nowrap">奪三振</th>
                  <th className="p-2 text-center whitespace-nowrap">失点</th>
                  <th className="p-2 text-center whitespace-nowrap">自責点</th>
                </tr>
              </thead>
              <tbody>
                {pitchingResults.map((pitcher) => (
                  <tr
                    key={pitcher.name}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-2 font-medium whitespace-nowrap">
                      {pitcher.name}
                    </td>
                    <td className="p-2 text-center">
                      {pitcher.inningsPitched}
                    </td>
                    <td className="p-2 text-center">{pitcher.hitsAllowed}</td>
                    <td className="p-2 text-center">{pitcher.strikeouts}</td>
                    <td className="p-2 text-center">{pitcher.runs}</td>
                    <td className="p-2 text-center">{pitcher.earnedRuns}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
