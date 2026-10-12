import type { Metadata } from "next";
import { eventStatusLabel, gameResultLabel } from "@/app/_constants/labels";
import {
  EVENT_TYPE_LABELS,
  parseEventType,
} from "@/app/_features/events/utils/event-type";
import { formatJstDateTimeWithDay } from "@/app/_utils/date/date";
import { Badge } from "@/app/(private)/admin/_components/badge";
import { EmptyState } from "@/app/(private)/admin/_components/empty-state";
import { FilterChips } from "@/app/(private)/admin/_components/filter-chips";
import { ListCard } from "@/app/(private)/admin/_components/list-card";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import {
  getEventList,
  getEventSeasons,
} from "@/app/(private)/admin/_data/event";

/** 状態を色でも区別する。開催予定は強調し、終わったものは目立たせない */
const statusTone = {
  scheduled: "default",
  completed: "muted",
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

  // season 未指定は最新シーズン
  const selectedSeason =
    seasons.find((s) => String(s.id) === params.season) ?? seasons[0];
  const type = parseEventType(params.type);

  const events = await getEventList({ seasonId: selectedSeason?.id, type });

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
  const seasonKey = selectedSeason && String(selectedSeason.id);

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
          href: hrefOf(String(s.id), type),
          active: seasonKey === String(s.id),
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
      {events.length === 0 ? (
        <EmptyState message="イベントがまだ登録されていません" />
      ) : (
        <ul className="border-t">
          {events.map((event) => {
            const game = event.game;
            const hasScore =
              game?.teamScore != null && game.opponentScore != null;
            const place = event.practice?.ground?.name;
            return (
              <ListCard
                key={event.id}
                href={`/admin/events/${event.id}`}
                title={
                  event.type === "game"
                    ? `vs ${game?.opponent?.name ?? "相手未定"}`
                    : "練習"
                }
                description={[formatJstDateTimeWithDay(event.date), place]
                  .filter(Boolean)
                  .join(" / ")}
                trailing={
                  <div className="flex flex-col items-end gap-1">
                    <Badge tone={statusTone[event.status]}>
                      {eventStatusLabel[event.status]}
                    </Badge>
                    {hasScore && (
                      <span className="text-sm font-bold">
                        {`${game.teamScore}-${game.opponentScore}${
                          game.result ? ` ${gameResultLabel[game.result]}` : ""
                        }`}
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
