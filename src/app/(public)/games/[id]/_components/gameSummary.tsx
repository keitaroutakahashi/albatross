import type { GameDetail } from "@/app/_features/games/api/getGames";
import { SectionGroup } from "@/app/(public)/games/[id]/_components/sectionGroup";

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
