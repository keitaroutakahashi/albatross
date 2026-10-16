import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { saveEventMembers } from "@/app/(private)/admin/_actions/event-member";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import { getEventParticipation } from "@/app/(private)/admin/_data/game";
import { parseId } from "@/app/(private)/admin/_utils/id";
import { EventMembersForm } from "@/app/(private)/admin/events/[id]/_components/event-members-form";

export const metadata: Metadata = {
  title: "参加メンバー",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const eventId = parseId((await params).id);
  const participation = await getEventParticipation(eventId);
  if (!participation) notFound();

  return (
    <>
      <PageHeader title="参加メンバー" backHref={`/admin/events/${eventId}`} />
      <EventMembersForm
        action={saveEventMembers.bind(null, eventId)}
        options={participation.members.map((m) => ({
          value: String(m.id),
          label: `#${m.uniformNumber} ${m.name}`,
        }))}
        selected={participation.selectedMemberIds.map(String)}
      />
    </>
  );
}
