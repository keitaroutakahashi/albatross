import { clsx } from "clsx";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { getUpcomingGames } from "@/app/_features/games/api/get-games";
import {
  formatAsDayName,
  formatAsMMDDWithDot,
  formatAsTime24,
  getDayOfWeek,
} from "@/app/_utils/date/date";

/** トップページに表示する今後の試合の件数 */
const DISPLAY_COUNT = 3;

/**
 * トップページの今後の試合セクション。
 * 開催日が近い順に 3 件表示し、末尾に試合一覧への導線を置く。
 */
export const Schedule = async () => {
  const games = await getUpcomingGames(DISPLAY_COUNT);

  // 開催予定の試合が無い場合は非表示にする
  if (games.length === 0) {
    return null;
  }

  return (
    <section className="px-5 py-12 md:py-16">
      <h2 className="text-center font-(family-name:--font-roboto) text-2xl md:text-4xl font-bold tracking-widest">
        SCHEDULE
      </h2>

      <ul className="mt-8 md:mt-10 border-t border-gray-200">
        {games.map((game) => {
          const dayOfWeek = getDayOfWeek(game.date);

          return (
            <li key={game.id} className="border-b border-gray-200">
              <Link
                href={`/games/${game.id}`}
                className="group flex flex-col gap-y-1 px-2 py-4 transition-colors hover:bg-gray-50 md:flex-row md:items-center md:gap-x-6"
              >
                <div className="flex items-baseline gap-x-2 md:w-52">
                  <span className="font-(family-name:--font-roboto) text-xl font-bold tracking-wider">
                    {formatAsMMDDWithDot(game.date)}
                  </span>
                  {/* 括弧は黒のまま、曜日のみ日曜=赤・土曜=青にする */}
                  <span className="text-sm font-bold">
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
                  </span>
                  <span className="font-(family-name:--font-roboto) text-base font-bold tracking-wider">
                    {formatAsTime24(game.date)}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">
                    {game.league?.name ?? ""}
                  </p>
                  <p className="text-sm font-bold">
                    vs {game.opponent?.name ?? "未定"}
                  </p>
                </div>

                <p className="text-sm text-gray-600 md:w-52 md:text-right">
                  {game.ground?.name ?? "会場未定"}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 flex justify-center">
        <Link
          href="/games"
          className="group flex items-center gap-x-1 text-sm font-bold underline underline-offset-4 hover:opacity-70"
        >
          試合一覧を見る
          <ChevronRight
            aria-hidden
            className="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </section>
  );
};
