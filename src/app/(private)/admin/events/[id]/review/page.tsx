import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updateEventReview } from "@/app/(private)/admin/_actions/event";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import { getEvent } from "@/app/(private)/admin/_data/event";
import { getMvpEditorData } from "@/app/(private)/admin/_data/game";
import { parseId } from "@/app/(private)/admin/_utils/id";
import { toEventFormInitial } from "@/app/(private)/admin/events/_components/event-form-initial";
import { EventReviewForm } from "@/app/(private)/admin/events/_components/event-review-form";

export const metadata: Metadata = {
  title: "試合の振り返り",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = parseId((await params).id);
  const event = await getEvent(id);
  // 振り返りがあるのは試合だけ
  if (!event?.game) notFound();
  const initial = toEventFormInitial(event);
  const { candidates, mvps } = await getMvpEditorData(event.game.id);

  return (
    <>
      <PageHeader title="試合の振り返り" backHref={`/admin/events/${id}`} />
      <EventReviewForm
        action={updateEventReview.bind(null, id)}
        eventId={id}
        mvpCandidates={candidates.map((c) => ({
          value: String(c.memberId),
          label: `#${c.uniformNumber} ${c.name}`,
        }))}
        initial={{
          ...initial,
          mvps: mvps.map((m) => ({
            memberId: String(m.memberId),
            comment: m.comment ?? "",
          })),
        }}
      />
    </>
  );
}
