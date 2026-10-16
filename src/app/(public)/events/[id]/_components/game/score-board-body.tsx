import type { GameDetail } from "@/app/_features/games/api/get-games";
import { ScoreBoardCell } from "@/app/(public)/events/[id]/_components/game/score-board-cell";
import { ScoreBoardTeamIcon } from "@/app/(public)/events/[id]/_components/game/score-board-team-icon";

type Props = {
  game: GameDetail;
  innings: {
    id: number;
    teamScore: number | null;
    opponentScore: number | null;
  }[];
  isScheduled: boolean;
  showForfeitedRuns: boolean;
};

// イニングでの得点に献上点（試合開始時に与えられた得点）を加算した合計を返す
const addForfeitedRuns = (
  score: number | null,
  forfeitedRuns: number | null,
) => (score === null ? null : score + (forfeitedRuns ?? 0));

export const ScoreBoardBody = ({
  game,
  innings,
  isScheduled,
  showForfeitedRuns,
}: Props) => {
  // 予定試合は集計値が入っていても表示しない
  const hideIfScheduled = (score: number | null) =>
    isScheduled ? null : score;

  return (
    <tbody>
      {/* 先攻 */}
      <tr className="bg-white">
        <ScoreBoardTeamIcon
          isFirstBatting={game.isFirstBatting}
          opponentName={game.opponent?.name ?? "未定"}
        />
        {innings.map((inning) => (
          <ScoreBoardCell
            isBold
            key={inning.id}
            score={
              game.isFirstBatting ? inning.opponentScore : inning.teamScore
            }
          />
        ))}
        <ScoreBoardCell
          isBold
          bgColor="bg-gray-100"
          score={hideIfScheduled(
            game.isFirstBatting
              ? addForfeitedRuns(game.teamScore, game.teamForfeitedRuns)
              : addForfeitedRuns(
                  game.opponentScore,
                  game.opponentForfeitedRuns,
                ),
          )}
        />
        <ScoreBoardCell
          bgColor="bg-gray-100"
          score={hideIfScheduled(
            game.isFirstBatting ? game.teamHits : game.opponentHits,
          )}
        />
        <ScoreBoardCell
          bgColor="bg-gray-100"
          score={hideIfScheduled(
            game.isFirstBatting ? game.teamErrors : game.opponentErrors,
          )}
        />
        {showForfeitedRuns && (
          <ScoreBoardCell
            bgColor="bg-gray-100"
            score={
              game.isFirstBatting
                ? game.teamForfeitedRuns
                : game.opponentForfeitedRuns
            }
          />
        )}
      </tr>

      {/* 後攻 */}
      <tr className="bg-white">
        <ScoreBoardTeamIcon
          isFirstBatting={!game.isFirstBatting}
          opponentName={game.opponent?.name ?? "未定"}
        />

        {innings.map((inning) => (
          <ScoreBoardCell
            isBold
            key={inning.id}
            score={
              game.isFirstBatting ? inning.opponentScore : inning.teamScore
            }
          />
        ))}
        <ScoreBoardCell
          isBold
          bgColor="bg-gray-100"
          score={hideIfScheduled(
            game.isFirstBatting
              ? addForfeitedRuns(game.opponentScore, game.opponentForfeitedRuns)
              : addForfeitedRuns(game.teamScore, game.teamForfeitedRuns),
          )}
        />
        <ScoreBoardCell
          bgColor="bg-gray-100"
          score={hideIfScheduled(
            game.isFirstBatting ? game.opponentHits : game.teamHits,
          )}
        />
        <ScoreBoardCell
          bgColor="bg-gray-100"
          score={hideIfScheduled(
            game.isFirstBatting ? game.opponentErrors : game.teamErrors,
          )}
        />
        {showForfeitedRuns && (
          <ScoreBoardCell
            bgColor="bg-gray-100"
            score={
              game.isFirstBatting
                ? game.opponentForfeitedRuns
                : game.teamForfeitedRuns
            }
          />
        )}
      </tr>
    </tbody>
  );
};
