import type { GameDetail } from "@/app/_features/games/api/get-games";
import { SectionGroup } from "@/app/(public)/games/[id]/_components/section-group";

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
