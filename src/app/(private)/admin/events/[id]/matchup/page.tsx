import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updateEventMatchup } from "@/app/(private)/admin/_actions/event";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import {
  getEvent,
  getEventFormOptions,
} from "@/app/(private)/admin/_data/event";
import { parseId } from "@/app/(private)/admin/_utils/id";
import { toEventFormInitial } from "@/app/(private)/admin/events/_components/event-form-initial";
import { EventMatchupForm } from "@/app/(private)/admin/events/_components/event-matchup-form";

export const metadata: Metadata = {
  title: "対戦",
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
  // 対戦があるのは試合だけ
  if (!event?.game) notFound();
  const initial = toEventFormInitial(event);

  return (
    <>
      <PageHeader title="対戦" backHref={`/admin/events/${id}`} />
      <EventMatchupForm
        action={updateEventMatchup.bind(null, id)}
        options={options}
        initial={initial}
      />
    </>
  );
}
