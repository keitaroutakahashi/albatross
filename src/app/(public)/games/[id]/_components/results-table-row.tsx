import { positionLabel } from "@/app/_constants/labels";
import type { GameDetail } from "@/app/_features/games/api/get-games";
import {
  formatAtBatResult,
  getResultColorClass,
  hitResults,
  nonAtBatResults,
} from "@/app/_features/games/utils/at-bat-result";
import { AtBatResultBadge } from "@/app/(public)/games/[id]/_components/at-bat-result-badge";

type Props = {
  gameMember: GameDetail["gameMembers"][number];
  inningCount: number;
};

export const ResultsTableRow = ({ gameMember, inningCount }: Props) => {
  const pas = gameMember.plateAppearances;
  const atBats = pas.filter(
    (pa) => !nonAtBatResults.includes(pa.result),
  ).length;
  const hits = pas.filter((pa) => hitResults.includes(pa.result)).length;
  const rbi = pas.reduce((sum, pa) => sum + pa.rbi, 0);
  const homeRuns = pas.filter((pa) => pa.result === "homeRun").length;

  // イニング別の打席結果マップ（同一イニング複数打席対応）
  const inningResultMap = new Map<
    number,
    { text: string; colorClass: string; rbi: number }[]
  >();
  for (const pa of pas) {
    const results = inningResultMap.get(pa.inningNumber) ?? [];
    results.push({
      text: formatAtBatResult(pa.result, pa.direction),
      colorClass: getResultColorClass(pa.result),
      rbi: pa.rbi,
    });
    inningResultMap.set(pa.inningNumber, results);
  }

  return (
    <tr
      key={gameMember.id}
      className="border-b border-gray-200 hover:bg-gray-50"
    >
      <td className="p-2 text-center whitespace-nowrap sticky left-0 bg-white z-10">
        {gameMember.battingOrder}
      </td>
      <td className="p-2 text-gray-500 whitespace-nowrap sticky left-10 bg-white z-10">
        {gameMember.position ? positionLabel[gameMember.position] : ""}
      </td>
      <td className="p-2 font-medium whitespace-nowrap sticky left-20 bg-white z-10">
        {gameMember.member.name}
      </td>
      <td className="p-2 text-center">{atBats}</td>
      <td className="p-2 text-center">{hits}</td>
      <td className="p-2 text-center">{rbi}</td>
      <td className="p-2 text-center">{homeRuns}</td>
      <td className="p-2 text-center">{gameMember.stolenBases}</td>
      {Array.from({ length: inningCount }, (_, i) => {
        const results = inningResultMap.get(i + 1);

        return (
          <td
            // biome-ignore lint/suspicious/noArrayIndexKey: イニング番号は並び順そのものであり順序は変わらない
            key={`${gameMember.id}-inning-${i + 1}`}
            className="p-2 w-14 @content:w-auto text-center whitespace-nowrap space-y-1"
          >
            {results
              ? results.map((r, j) => (
                  <AtBatResultBadge
                    // biome-ignore lint/suspicious/noArrayIndexKey: 同一イニング内の打席結果は入力順で固定されており順序は変わらない
                    key={`${i + 1}-${j + 1}`}
                    text={r.text}
                    colorClass={r.colorClass}
                    rbi={r.rbi}
                  />
                ))
              : ""}
          </td>
        );
      })}
    </tr>
  );
};
