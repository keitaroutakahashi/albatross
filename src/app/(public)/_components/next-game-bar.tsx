import { clsx } from "clsx";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getUpcomingGame } from "@/app/_features/games/api/get-games";
import {
  formatAsDayName,
  formatAsMMDDWithDot,
  formatAsTime24,
  getDayOfWeek,
} from "@/app/_utils/date/date";
import { GameCountdown } from "@/app/(public)/_components/game-countdown";

/**
 * Hero の下端に表示する、次の試合の情報バー。
 * SP・PC ともに「日時 + 会場 / 対戦相手 + 導線 / カウントダウン」の 3 段で表示する。
 */
export const NextGameBar = async () => {
  const game = await getUpcomingGame();

  // 開催予定の試合が無い場合は非表示にする
  if (!game) {
    return null;
  }

  const opponentName = game.opponent?.name ?? "未定";
  const dayOfWeek = getDayOfWeek(game.date);

  return (
    <div className="border-t-2 border-secondary bg-primary text-white">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 px-5 py-4 md:gap-x-4">
        <p className="text-sm font-bold tracking-widest whitespace-nowrap">
          [ NEXT GAME ]
        </p>

        <div className="flex items-baseline gap-x-2">
          <p className="font-(family-name:--font-roboto) text-2xl font-bold tracking-wider">
            {formatAsMMDDWithDot(game.date)}
          </p>
          <p className="text-sm font-bold">
            (
            <span
              className={clsx({
                "text-red-400": dayOfWeek === 0,
                "text-blue-400": dayOfWeek === 6,
              })}
            >
              {formatAsDayName(game.date)}
            </span>
            )
          </p>
          <p className="font-(family-name:--font-roboto) text-sm font-bold tracking-wider">
            {formatAsTime24(game.date)}
          </p>
          <p className="text-sm font-bold">{game.ground?.name ?? "会場未定"}</p>
        </div>

        {/* 2 段目に送る */}
        <div className="basis-full" />

        {/* 対戦カード全体を試合詳細への導線にする */}
        <Link
          href={`/games/${game.id}`}
          className="group flex items-center gap-x-3 border-b border-white/40 py-1.5 pl-4 pr-3 transition-colors"
        >
          {/* Albatross は常に左側に固定する */}
          <Image
            src="/images/logo-initial.png"
            alt="Albatross"
            width={100}
            height={115}
            className="w-7 h-auto"
          />
          <span className="font-(family-name:--font-roboto) text-lg font-bold text-white/40">
            VS
          </span>
          <span className="text-sm font-bold">{opponentName}</span>
          <ChevronRight
            aria-hidden
            className="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </Link>

        {/* 3 段目に送る */}
        <div className="basis-full" />

        <div className="flex items-center gap-x-2">
          <GameCountdown targetDate={game.date.toISOString()} />
        </div>
      </div>
    </div>
  );
};
