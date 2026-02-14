import type { GameWithRelations } from "@/app/_features/games/api/getGames";
import { ResultsTableHeader } from "@/app/(public)/games/[id]/_components/resultsTableHeader";
import { ResultsTableRow } from "@/app/(public)/games/[id]/_components/resultsTableRow";
import { SectionHeader } from "@/app/(public)/games/[id]/_components/sectionHeader";
import { SectionSubtitle } from "@/app/(public)/games/[id]/_components/sectionSubTitle";

type Props = {
  game: GameWithRelations;
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
    <section>
      <SectionHeader text="出場成績" />

      <div className="mt-4" />

      <div className="space-y-8">
        <section>
          <SectionSubtitle text="打者成績" />
          <div className="overflow-x-auto">
            <table className="text-sm border-collapse md:w-full md:table-fixed">
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
        </section>

        <section>
          <SectionSubtitle text="投手成績" />
        </section>
      </div>
    </section>
  );
};
