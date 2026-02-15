import type { GameDetail } from "@/app/_features/games/api/getGames";
import { SectionHeader } from "@/app/(public)/games/[id]/_components/sectionHeader";

type Props = {
  game: GameDetail;
};

export const GameSummary = ({ game }: Props) => {
  return (
    <section className="mb-6">
      <SectionHeader text="戦評" />
      <div className="">
        <p className="mt-4 whitespace-pre-wrap text-sm">
          ZERO POINT様ご対戦ありがとうございました
          投手陣が粘りの投球をしてくれた点と 前回全然打てなかった西埜投手から
          7得点とチーム全体でいい打撃をすることができました MVP やぎした
          4回3失点、3打数2安打2打点と投打共に大活躍 ヤマト
          3打数2安打とチームの打撃を大きく牽引してくれました ゴリ
          2回2失点で2回にランナーを貯めるも
          何とか粘りの投球で試合を作ってくれました
          さらには3打数2安打2打点と打線も牽引 これで今季の公式戦は終了となります
          皆様1年間お疲れ様でした 来季もいいシーズンにできるよう
          全員野球で引き続き頑張っていきましょう
        </p>
      </div>
    </section>
  );
};
