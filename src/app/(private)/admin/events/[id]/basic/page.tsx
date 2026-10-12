import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EVENT_TYPE_LABELS } from "@/app/_features/events/utils/event-type";
import { formatJstDateTimeWithDay } from "@/app/_utils/date/date";
import {
  deleteEvent,
  updateEventBasic,
} from "@/app/(private)/admin/_actions/event";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import {
  getEvent,
  getEventFormOptions,
} from "@/app/(private)/admin/_data/event";
import { parseId } from "@/app/(private)/admin/_utils/id";
import { EventBasicForm } from "@/app/(private)/admin/events/_components/event-basic-form";
import { toEventFormInitial } from "@/app/(private)/admin/events/_components/event-form-initial";

export const metadata: Metadata = {
  title: "基本情報",
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

  return (
    <>
      <PageHeader title="基本情報" backHref={`/admin/events/${id}`} />
      <EventBasicForm
        action={updateEventBasic.bind(null, id)}
        options={options}
        initial={toEventFormInitial(event)}
        deleteTarget={{
          name: `${formatJstDateTimeWithDay(event.date)} ${EVENT_TYPE_LABELS[event.type]}`,
          warning:
            "結果・出場した選手・成績などの関連データもすべて削除されます。",
          action: deleteEvent.bind(null, id),
        }}
      />
    </>
  );
}
