import type { GameDetail } from "@/app/_features/games/api/get-games";
import { SectionHeader } from "@/app/(public)/games/[id]/_components/section-header";
import { SectionSubtitle } from "@/app/(public)/games/[id]/_components/section-sub-title";

type Props = {
  game: GameDetail;
};

export const AIAnalysis = ({ game }: Props) => {
  return (
    <section>
      <SectionHeader text="AI分析" />
      <div className="flex flex-col gap-y-5">
        <section className="flex flex-col gap-y-2">
          <SectionSubtitle text="評価点" />
          <p className="whitespace-pre-line text-sm">{game?.aiGoodPoints}</p>
        </section>
        <section className="flex flex-col gap-y-2">
          <SectionSubtitle text="改善点" />
          <p className="whitespace-pre-line text-sm">{game?.aiBadPoints}</p>
        </section>
      </div>
    </section>
  );
};
