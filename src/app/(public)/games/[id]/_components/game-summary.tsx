import { SectionGroup } from "@/app/_components/ui/section-group";
import type { GameDetail } from "@/app/_features/games/api/get-games";

type Props = {
  game: GameDetail;
};

export const GameSummary = ({ game }: Props) => {
  return (
    <SectionGroup title="戦評">
      <div className="">
        <p className="whitespace-pre-wrap text-sm">{game.summary}</p>
      </div>
    </SectionGroup>
  );
};
