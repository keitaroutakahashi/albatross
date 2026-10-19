import type { GameDetail } from "@/app/_features/games/api/get-games";
import { SectionHeader } from "@/app/(public)/events/[id]/_components/game/section-header";
import { SectionSubtitle } from "@/app/(public)/events/[id]/_components/game/section-sub-title";

type Props = {
  game: GameDetail;
};

export const AIAnalysis = ({ game }: Props) => {
  // 終了した試合は、情報があるものだけを表示する
  const hideEmpty = game.event.status === "completed";
  const showGoodPoints = !hideEmpty || !!game.aiGoodPoints?.trim();
  const showBadPoints = !hideEmpty || !!game.aiBadPoints?.trim();

  if (!showGoodPoints && !showBadPoints) {
    return null;
  }

  return (
    <section>
      <SectionHeader text="AI分析" />
      <div className="flex flex-col gap-y-5">
        {showGoodPoints && (
          <section className="flex flex-col gap-y-2">
            <SectionSubtitle text="評価点" />
            <p className="whitespace-pre-line text-sm">{game.aiGoodPoints}</p>
          </section>
        )}
        {showBadPoints && (
          <section className="flex flex-col gap-y-2">
            <SectionSubtitle text="改善点" />
            <p className="whitespace-pre-line text-sm">{game.aiBadPoints}</p>
          </section>
        )}
      </div>
    </section>
  );
};
