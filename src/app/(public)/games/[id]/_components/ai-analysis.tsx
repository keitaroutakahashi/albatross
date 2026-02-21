import type { GameDetail } from "@/app/_features/games/api/get-games";
import { SectionHeader } from "@/app/(public)/games/[id]/_components/section-header";
import { SectionSubtitle } from "@/app/(public)/games/[id]/_components/section-sub-title";

type Props = {
  game: GameDetail;
};

export const AIAnalysis = ({ game: _game }: Props) => {
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
