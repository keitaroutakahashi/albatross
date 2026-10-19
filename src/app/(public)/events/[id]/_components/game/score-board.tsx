import type { GameDetail } from "@/app/_features/games/api/get-games";
import { ScoreBoardBody } from "@/app/(public)/events/[id]/_components/game/score-board-body";
import { ScoreBoardHeader } from "@/app/(public)/events/[id]/_components/game/score-board-header";

type Props = {
  game: GameDetail;
};

// 予定・中止の試合は試合が行われておらず、イニングのデータがないため、
// 草野球の標準的な 7 回分を表示する（値は「-」）
const UNPLAYED_INNING_COUNT = 7;

export const ScoreBoard = ({ game }: Props) => {
  // 終了した試合は、イニングの得点がなければスコアボードごと表示しない
  if (game.event.status === "completed" && game.innings.length === 0) {
    return null;
  }

  const isUnplayed =
    game.event.status === "scheduled" || game.event.status === "canceled";
  // 献上点がどちらのチームにもない試合では列ごと非表示にする
  const showForfeitedRuns =
    !isUnplayed && (!!game.teamForfeitedRuns || !!game.opponentForfeitedRuns);
  const innings = isUnplayed
    ? Array.from({ length: UNPLAYED_INNING_COUNT }, (_, i) => ({
        id: i + 1,
        inningNumber: i + 1,
        teamScore: null,
        opponentScore: null,
      }))
    : game.innings;

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed border">
        <colgroup>
          <col className="w-10 @content:w-20" />
        </colgroup>
        <ScoreBoardHeader
          innings={innings}
          showForfeitedRuns={showForfeitedRuns}
        />
        <ScoreBoardBody
          game={game}
          innings={innings}
          isUnplayed={isUnplayed}
          showForfeitedRuns={showForfeitedRuns}
        />
      </table>

      {!isUnplayed && !!game.teamForfeitedRuns && (
        <p className="text-xs mt-2 text-gray-500">
          ※ 自チームの得点には献上点 {game.teamForfeitedRuns} 点を含む
        </p>
      )}
      {!isUnplayed && !!game.opponentForfeitedRuns && (
        <p className="text-xs mt-2 text-gray-500">
          ※ 相手チームの得点には献上点 {game.opponentForfeitedRuns} 点を含む
        </p>
      )}
    </div>
  );
};
