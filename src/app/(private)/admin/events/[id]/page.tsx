import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EVENT_TYPE_LABELS } from "@/app/_features/events/utils/event-type";
import { formatJstDateTimeWithDay } from "@/app/_utils/date/date";
import { deleteEvent, updateEvent } from "@/app/(private)/admin/_actions/event";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import {
  getEvent,
  getEventFormOptions,
} from "@/app/(private)/admin/_data/event";
import { getGameRelatedCounts } from "@/app/(private)/admin/_data/game";
import { parseId } from "@/app/(private)/admin/_utils/id";
import { EventForm } from "@/app/(private)/admin/events/_components/event-form";
import { toEventFormInitial } from "@/app/(private)/admin/events/_components/event-form-initial";
import { RelatedLinks } from "@/app/(private)/admin/events/[id]/_components/related-links";

export const metadata: Metadata = {
  title: "イベントを編集",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = parseId((await params).id);
  const [event, options] = await Promise.all([
    getEvent(id),
    getEventFormOptions(),
  ]);
  if (!event) notFound();

  const gameCounts = event.game
    ? await getGameRelatedCounts(event.game.id)
    : null;

  return (
    <>
      <PageHeader title="イベントを編集" backHref="/admin/events" />
      <RelatedLinks
        eventId={id}
        type={event.type}
        counts={{
          innings: gameCounts?.innings ?? 0,
          gameMembers: gameCounts?.gameMembers ?? 0,
          plateAppearances: gameCounts?.plateAppearances ?? 0,
          pitchingResults: gameCounts?.pitchingResults ?? 0,
          practiceMembers: event.practice?._count.practiceMembers ?? 0,
        }}
      />
      <EventForm
        action={updateEvent.bind(null, id)}
        options={options}
        initial={toEventFormInitial(event)}
        deleteTarget={{
          name: `${formatJstDateTimeWithDay(event.date)} ${EVENT_TYPE_LABELS[event.type]}`,
          warning:
            "結果・出場メンバー・成績などの関連データもすべて削除されます。",
          action: deleteEvent.bind(null, id),
        }}
      />
    </>
  );
}
