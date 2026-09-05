import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/_components/shadcn/button";
import { InitialIcon } from "@/app/_components/ui/initial-icon";
import {
  type GameWithRelations,
  getLatestCompletedGame,
} from "@/app/_features/games/api/get-games";
import {
  formatAsYYYYMMDDWithDot,
  formatToShortDayNameEn,
} from "@/app/_utils/date/date";

const getResultLabel = (result: GameWithRelations["result"]) => {
  switch (result) {
    case "win":
      return { text: "WIN", className: "bg-secondary text-white" };
    case "lose":
      return { text: "LOSE", className: "bg-white text-primary" };
    case "draw":
      return { text: "DRAW", className: "bg-white/30 text-white" };
    default:
      return null;
  }
};

export const LatestGame = async () => {
  const game = await getLatestCompletedGame();

  // 直近 1 ヶ月以内に終了した試合が無い場合は非表示にする
  if (!game) {
    return null;
  }

  const opponentName = game.opponent?.name ?? "未定";
  const resultLabel = getResultLabel(game.result);

  return (
    <section className="relative overflow-hidden bg-primary text-white pt-16 md:pt-24">
      {/* 背景の透かしロゴ */}
      <Image
        src="/images/logo-initial.png"
        alt=""
        width={100}
        height={115}
        className="pointer-events-none absolute -left-16 top-1/2 w-72 h-auto -translate-y-1/2 opacity-10 md:w-lg"
      />

      <div className="relative px-5 py-12 md:px-10 md:py-20">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-6">
          <div className="flex items-center gap-4">
            <p className="font-(family-name:--font-roboto) text-sm md:text-base font-bold tracking-widest">
              {formatAsYYYYMMDDWithDot(game.date)}{" "}
              <span className="uppercase">
                {formatToShortDayNameEn(game.date)}
              </span>
            </p>
            <span className="hidden md:block h-px flex-1 bg-white/30" />
          </div>

          <h2 className="text-center font-(family-name:--font-roboto) text-3xl md:text-4xl font-bold tracking-widest">
            LATEST GAME
          </h2>

          <div className="flex items-center justify-center md:justify-end gap-4">
            <span className="hidden md:block h-px flex-1 bg-white/30" />
            {resultLabel && (
              <span
                className={`${resultLabel.className} rounded px-3 py-1 font-(family-name:--font-roboto) text-sm md:text-base font-bold tracking-widest`}
              >
                {resultLabel.text}
              </span>
            )}
          </div>
        </div>

        {/* 中央列はスコアの幅に合わせて広がるようにし、2 桁同士でも折り返させない */}
        <div className="mt-12 md:mt-16 grid grid-cols-[1fr_auto_1fr] place-items-center gap-3 md:gap-6">
          {/* Albatross は常に左側に固定する */}
          <div className="flex flex-col items-center gap-y-3">
            <Image
              src="/images/logo-initial.png"
              alt=""
              width={100}
              height={115}
              className="w-16 md:w-24 h-auto"
            />
            <p className="text-center text-sm md:text-base font-bold">
              Albatross
            </p>
          </div>

          <div className="flex flex-col items-center gap-y-4">
            <p className="flex items-center gap-x-3 font-(family-name:--font-roboto) text-6xl md:text-7xl font-bold leading-none tracking-wider whitespace-nowrap tabular-nums">
              <span>{game.teamScore ?? "-"}</span>
              <span className="text-3xl md:text-4xl text-white/60">-</span>
              <span>{game.opponentScore ?? "-"}</span>
            </p>
            <p className="max-w-32 md:max-w-56 text-center text-xs md:text-base font-bold text-white/70">
              {game.ground?.name ?? "会場未定"}
            </p>
          </div>

          <div className="flex flex-col items-center gap-y-3">
            <InitialIcon name={opponentName} size="2xl" />
            <p className="text-center text-sm md:text-base font-bold">
              {opponentName}
            </p>
          </div>
        </div>

        <div className="mt-12 md:mt-16 flex justify-center">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <Link href={`/games/${game.id}`}>試合結果を見る</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
