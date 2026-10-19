import { SectionGroup } from "@/app/_components/ui/section-group";
import type { GameDetail } from "@/app/_features/games/api/get-games";

type Props = {
  game: GameDetail;
};

export const GameSummary = ({ game }: Props) => {
  // 終了した試合は、情報があるものだけを表示する
  if (game.event.status === "completed" && !game.summary?.trim()) {
    return null;
  }

  return (
    <SectionGroup title="戦評">
      <div className="">
        <p className="whitespace-pre-wrap text-sm">{game.summary}</p>
      </div>
    </SectionGroup>
  );
};
