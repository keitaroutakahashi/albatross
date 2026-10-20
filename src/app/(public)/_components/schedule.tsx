import { clsx } from "clsx";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  getRecentCompletedEvents,
  type RecentEvent,
} from "@/app/_features/events/api/get-events";
import {
  formatAsDayName,
  formatAsMMDDWithDot,
  formatAsTime24,
  getDayOfWeek,
} from "@/app/_utils/date/date";

/** トップページに表示する、終了したイベントの件数 */
const DISPLAY_COUNT = 3;

// イベント種別ごとの表示内容
const getEventInfo = (event: RecentEvent) => {
  if (event.game) {
    return {
      href: `/events/${event.id}` as const,
      subtitle: event.game.league?.name ?? "",
      title: `vs ${event.game.opponent?.name ?? "未定"}`,
      groundName: event.game.ground?.name,
    };
  }

  if (event.practice) {
    return {
      href: `/events/${event.id}` as const,
      subtitle: "",
      title: "練習",
      groundName: event.practice.ground?.name,
    };
  }

  return null;
};

/**
 * トップページのイベントセクション。
 * 終了した試合・練習を開催日が新しい順に 3 件、常に表示し、末尾にイベント一覧への導線を置く。
 * 次の試合は NextGameBar が表示するため、ここには今後の予定を出さない。
 */
export const Schedule = async () => {
  const events = await getRecentCompletedEvents(DISPLAY_COUNT);

  // 終了したイベントが 1 件も無い場合は非表示にする
  if (events.length === 0) {
    return null;
  }

  return (
    <section className="px-5 py-12 md:py-16">
      <h2 className="text-center font-(family-name:--font-roboto) text-2xl md:text-4xl font-bold tracking-widest">
        EVENT
      </h2>

      <ul className="mt-8 md:mt-10 border-t border-gray-200">
        {events.map((event) => {
          const info = getEventInfo(event);

          if (!info) {
            return null;
          }

          const dayOfWeek = getDayOfWeek(event.date);
          const content = (
            <>
              <div className="flex items-baseline gap-x-2 md:w-52">
                <span className="font-(family-name:--font-roboto) text-xl font-bold tracking-wider">
                  {formatAsMMDDWithDot(event.date)}
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
                    {formatAsDayName(event.date)}
                  </span>
                  )
                </span>
                <span className="font-(family-name:--font-roboto) text-base font-bold tracking-wider">
                  {formatAsTime24(event.date)}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">{info.subtitle}</p>
                <p className="text-sm font-bold">{info.title}</p>
              </div>

              <p className="text-sm text-gray-600 md:w-52 md:text-right">
                {info.groundName ?? "会場未定"}
              </p>
            </>
          );

          return (
            <li key={event.id} className="border-b border-gray-200">
              <Link
                href={info.href}
                className="group flex flex-col gap-y-1 px-2 py-4 transition-colors hover:bg-gray-50 md:flex-row md:items-center md:gap-x-6"
              >
                {content}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 flex justify-center">
        <Link
          href="/events"
          className="group flex items-center gap-x-1 text-sm font-bold underline underline-offset-4 hover:opacity-70"
        >
          イベント一覧を見る
          <ChevronRight
            aria-hidden
            className="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </section>
  );
};
