import type { GameDetail } from "@/app/_features/games/api/getGames";
import { GamePitchers } from "@/app/(public)/games/[id]/_components/gamePitchers";
import { ResultsTableHeader } from "@/app/(public)/games/[id]/_components/resultsTableHeader";
import { ResultsTableRow } from "@/app/(public)/games/[id]/_components/resultsTableRow";
import { SectionGroup } from "@/app/(public)/games/[id]/_components/sectionGroup";
import { SubSectionGroup } from "@/app/(public)/games/[id]/_components/subSectionGroup";

type Props = {
  game: GameDetail;
};

export const GameResults = ({ game }: Props) => {
  const starters = game.gameMembers.filter(
    (gm) => gm.memberType === "starting",
  );

  if (starters.length === 0) {
    return null;
  }

  const inningCount = game.innings.length;

  return (
    <SectionGroup title="出場成績">
      <div className="space-y-8">
        <SubSectionGroup title="打者成績">
          <div className="overflow-x-auto">
            <table className="text-sm md:text-base border-collapse md:w-full md:table-fixed">
              <ResultsTableHeader inningCount={inningCount} />
              <tbody>
                {starters.map((gm) => (
                  <ResultsTableRow
                    key={gm.id}
                    gameMember={gm}
                    inningCount={inningCount}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </SubSectionGroup>

        <SubSectionGroup title="投手成績">
          <GamePitchers game={game} />
        </SubSectionGroup>
      </div>
    </SectionGroup>
  );
};
