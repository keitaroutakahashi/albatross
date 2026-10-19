import { SectionGroup } from "@/app/_components/ui/section-group";
import { SubSectionGroup } from "@/app/_components/ui/sub-section-group";
import type { GameDetail } from "@/app/_features/games/api/get-games";
import { ScoringPositionLegend } from "@/app/(public)/events/[id]/_components/game/at-bat-result-badge";
import { GamePitchers } from "@/app/(public)/events/[id]/_components/game/game-pitchers";
import { ResultsTableHeader } from "@/app/(public)/events/[id]/_components/game/results-table-header";
import { ResultsTableRow } from "@/app/(public)/events/[id]/_components/game/results-table-row";

type Props = {
  game: GameDetail;
};

export const GameResults = ({ game }: Props) => {
  if (game.event.status === "scheduled") {
    return <SectionGroup title="個人成績" />;
  }

  const starters = game.gameMembers.filter(
    (gm) => gm.memberType === "starting",
  );

  if (starters.length === 0) {
    return null;
  }

  // 終了した試合は、投手成績がなければ項目ごと表示しない
  const showPitchers =
    game.event.status !== "completed" ||
    game.gameMembers.some((gm) => gm.pitchingResult != null);

  // 得点圏の打席がある試合だけ、凡例を出す
  const hasScoringPosition = game.gameMembers.some((gm) =>
    gm.plateAppearances.some((pa) => pa.isScoringPosition),
  );

  // イニング得点が未入力・不足でも、打席があるイニングの成績は表示する
  const inningCount = Math.max(
    game.innings.length,
    ...game.gameMembers.flatMap((gm) =>
      gm.plateAppearances.map((pa) => pa.inningNumber),
    ),
  );

  return (
    <SectionGroup title="個人成績">
      <div className="space-y-8">
        <SubSectionGroup title="打者成績">
          <div className="overflow-x-auto">
            <table className="text-sm @content:text-base border-collapse w-full @content:table-fixed">
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
          {hasScoringPosition && <ScoringPositionLegend />}
        </SubSectionGroup>

        {showPitchers && (
          <SubSectionGroup title="投手成績">
            <GamePitchers game={game} />
          </SubSectionGroup>
        )}
      </div>
    </SectionGroup>
  );
};
