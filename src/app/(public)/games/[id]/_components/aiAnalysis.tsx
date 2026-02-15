import type { GameDetail } from "@/app/_features/games/api/getGames";
import { SectionHeader } from "@/app/(public)/games/[id]/_components/sectionHeader";
import { SectionSubtitle } from "@/app/(public)/games/[id]/_components/sectionSubTitle";

type Props = {
  game: GameDetail;
};

export const AIAnalysis = ({ game }: Props) => {
  const participantCount = game.gameMembers.length;

  return (
    <section>
      <SectionHeader text="AI分析" />
      <section>
        <SectionSubtitle text="評価点" />
      </section>
      <section>
        <SectionSubtitle text="改善点" />
      </section>
    </section>
  );
};
