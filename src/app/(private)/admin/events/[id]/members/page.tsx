import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { savePracticeMembers } from "@/app/(private)/admin/_actions/practice-member";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import {
  getPracticeCandidates,
  getPracticeOfEvent,
} from "@/app/(private)/admin/_data/game";
import { parseId } from "@/app/(private)/admin/_utils/id";
import { PracticeMembersForm } from "@/app/(private)/admin/events/[id]/_components/practice-members-form";

export const metadata: Metadata = {
  title: "参加メンバー",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const eventId = parseId((await params).id);
  const practice = await getPracticeOfEvent(eventId);
  if (!practice) notFound();
  const members = await getPracticeCandidates(practice.id);

  return (
    <>
      <PageHeader title="参加メンバー" backHref={`/admin/events/${eventId}`} />
      <PracticeMembersForm
        action={savePracticeMembers.bind(null, eventId)}
        options={members.map((m) => ({
          value: String(m.id),
          label: `#${m.uniformNumber} ${m.name}`,
        }))}
        selected={practice.practiceMembers.map((pm) => String(pm.memberId))}
      />
    </>
  );
}
