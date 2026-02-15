import type { GameDetail } from "@/app/_features/games/api/getGames";
import { SectionHeader } from "@/app/(public)/games/[id]/_components/sectionHeader";

type Props = {
  game: GameDetail;
};

export const GameStats = ({ game }: Props) => {
  const participantCount = game.gameMembers.length;

  return (
    <section>
      <SectionHeader text="チームスタッツ" />
      <div className="bg-gray-50 p-4 rounded">
        <div className="text-sm">
          <span className="text-gray-500">参加人数</span>
          <p className="font-medium">
            {participantCount > 0 ? `${participantCount}人` : "-"}
          </p>
        </div>
      </div>
    </section>
  );
};
