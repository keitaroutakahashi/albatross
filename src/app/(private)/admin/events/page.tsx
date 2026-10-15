import type { Metadata } from "next";
import { eventStatusLabel, gameResultLabel } from "@/app/_constants/labels";
import {
  EVENT_TYPE_LABELS,
  parseEventType,
} from "@/app/_features/events/utils/event-type";
import {
  formatJstDateTimeWithDay,
  isOnOrAfterJstDay,
} from "@/app/_utils/date/date";
import { Badge } from "@/app/(private)/admin/_components/badge";
import { EmptyState } from "@/app/(private)/admin/_components/empty-state";
import { FilterChips } from "@/app/(private)/admin/_components/filter-chips";
import { ListCard } from "@/app/(private)/admin/_components/list-card";
import { OverdueMark } from "@/app/(private)/admin/_components/overdue-mark";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import {
  getEventList,
  getEventSeasons,
} from "@/app/(private)/admin/_data/event";
import { formatGameScore } from "@/app/(private)/admin/_utils/event-display";
import { EventTypeTag } from "@/app/(private)/admin/events/_components/event-type-tag";

/** 状態を色で区別する。開催予定は水色、開催済みは緑、中止は赤（紺・金はブランドカラーのため使わない） */
const statusTone = {
  scheduled: "info",
  completed: "success",
  canceled: "danger",
} as const;

export const metadata: Metadata = {
  title: "イベント",
};

type SearchParams = Promise<{ season?: string; type?: string }>;

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const seasons = await getEventSeasons();

  // season は年（2026 など）で指定する。未指定・該当なしは最新シーズン
  const selectedSeason =
    seasons.find((s) => String(s.season) === params.season) ?? seasons[0];
  const type = parseEventType(params.type);

  const events = await getEventList({ seasonId: selectedSeason?.id, type });

  // 開催日の当日以降も「開催予定」のままなら、状態の更新を促す
  const now = new Date();
  const isOverdue = (event: (typeof events)[number]) =>
    event.status === "scheduled" && isOnOrAfterJstDay(now, event.date);
  const overdueCount = events.filter(isOverdue).length;

  const hrefOf = (
    season: string | undefined,
    eventType: string | undefined,
  ) => ({
    pathname: "/admin/events" as const,
    query: {
      ...(season ? { season } : {}),
      ...(eventType ? { type: eventType } : {}),
    },
  });
  const seasonKey = selectedSeason && String(selectedSeason.season);

  return (
    <>
      <PageHeader
        title="イベント"
        backHref="/admin"
        addHref="/admin/events/new"
      />
      <FilterChips
        chips={seasons.map((s) => ({
          label: `${s.season}年度`,
          href: hrefOf(String(s.season), type),
          active: seasonKey === String(s.season),
        }))}
      />
      <FilterChips
        chips={[
          {
            label: "すべて",
            href: hrefOf(seasonKey, undefined),
            active: !type,
          },
          ...Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => ({
            label,
            href: hrefOf(seasonKey, value),
            active: type === value,
          })),
        ]}
      />
      {overdueCount > 0 && (
        <p className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
          <OverdueMark />
          開催日を過ぎています。状態を更新してください。
        </p>
      )}
      {events.length === 0 ? (
        <EmptyState message="イベントがまだ登録されていません" />
      ) : (
        <ul className="border-t">
          {events.map((event) => {
            const game = event.game;
            const score = game ? formatGameScore(game) : null;
            const groundName =
              event.type === "game"
                ? game?.ground?.name
                : event.practice?.ground?.name;
            return (
              <ListCard
                key={event.id}
                href={`/admin/events/${event.id}`}
                marker={isOverdue(event) ? <OverdueMark /> : undefined}
                title={
                  <span className="flex items-center gap-2">
                    <span className="min-w-0 truncate">
                      {event.type === "game"
                        ? (game?.opponent?.name ?? "未定")
                        : "練習"}
                    </span>
                    <EventTypeTag type={event.type} gameType={game?.gameType} />
                  </span>
                }
                description={
                  <>
                    <span className="block">
                      {formatJstDateTimeWithDay(event.date)}
                    </span>
                    <span className="block truncate">
                      @{groundName ?? "未定"}
                    </span>
                  </>
                }
                trailing={
                  <div className="flex flex-col items-end gap-1">
                    <Badge tone={statusTone[event.status]}>
                      {eventStatusLabel[event.status]}
                    </Badge>
                    {score && (
                      <span className="text-sm font-bold">
                        {score}
                        {game?.result && ` ${gameResultLabel[game.result]}`}
                      </span>
                    )}
                  </div>
                }
              />
            );
          })}
        </ul>
      )}
    </>
  );
}
