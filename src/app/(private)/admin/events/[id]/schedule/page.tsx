import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updateEventSchedule } from "@/app/(private)/admin/_actions/event";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import {
  getEvent,
  getEventFormOptions,
} from "@/app/(private)/admin/_data/event";
import { parseId } from "@/app/(private)/admin/_utils/id";
import { toEventFormInitial } from "@/app/(private)/admin/events/_components/event-form-initial";
import { EventScheduleForm } from "@/app/(private)/admin/events/_components/event-schedule-form";

export const metadata: Metadata = {
  title: "いつ・どこで",
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
  const initial = toEventFormInitial(event);

  return (
    <>
      <PageHeader title="いつ・どこで" backHref={`/admin/events/${id}`} />
      <EventScheduleForm
        action={updateEventSchedule.bind(null, id)}
        options={options}
        initial={initial}
      />
    </>
  );
}
