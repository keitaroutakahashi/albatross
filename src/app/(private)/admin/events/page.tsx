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
import { getEventList } from "@/app/(private)/admin/_data/event";
import { getSeasonList } from "@/app/(private)/admin/_data/season";

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
  const seasons = await getSeasonList();

  // season 未指定は最新シーズン。"all" は全期間
  const allSeasons = params.season === "all";
  const selectedSeason = allSeasons
    ? undefined
    : (seasons.find((s) => String(s.id) === params.season) ?? seasons[0]);
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
  const seasonKey = allSeasons
    ? "all"
    : selectedSeason && String(selectedSeason.id);

  return (
    <>
      <PageHeader
        title="イベント"
        backHref="/admin"
        addHref="/admin/events/new"
      />
      <FilterChips
        chips={[
          ...seasons.map((s) => ({
            label: `${s.season}年度`,
            href: hrefOf(String(s.id), type),
            active: seasonKey === String(s.id),
          })),
          { label: "全期間", href: hrefOf("all", type), active: allSeasons },
        ]}
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
        <EmptyState message="イベントがありません" />
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
                  hasScore ? (
                    <Badge>
                      {`${game.teamScore}-${game.opponentScore}${
                        game.result ? ` ${gameResultLabel[game.result]}` : ""
                      }`}
                    </Badge>
                  ) : (
                    <Badge tone="muted">{eventStatusLabel[event.status]}</Badge>
                  )
                }
              />
            );
          })}
        </ul>
      )}
    </>
  );
}
