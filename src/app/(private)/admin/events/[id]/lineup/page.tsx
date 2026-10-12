import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { saveLineup } from "@/app/(private)/admin/_actions/lineup";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import {
  getGameOfEvent,
  getLineupCandidates,
} from "@/app/(private)/admin/_data/game";
import { parseId } from "@/app/(private)/admin/_utils/id";
import { LineupForm } from "@/app/(private)/admin/events/[id]/_components/lineup-form";

export const metadata: Metadata = {
  title: "出場した選手",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const eventId = parseId((await params).id);
  const game = await getGameOfEvent(eventId);
  if (!game) notFound();
  const { members, gameMembers } = await getLineupCandidates(game.id);

  const byMember = new Map(gameMembers.map((gm) => [gm.memberId, gm]));

  return (
    <>
      <PageHeader title="出場した選手" backHref={`/admin/events/${eventId}`} />
      <LineupForm
        action={saveLineup.bind(null, eventId)}
        members={members.map((m) => {
          const gm = byMember.get(m.id);
          return {
            id: m.id,
            label: `#${m.uniformNumber} ${m.name}`,
            initial: {
              memberType: gm?.memberType ?? "",
              battingOrder: gm?.battingOrder?.toString() ?? "",
              position: gm?.position ?? "",
              stolenBases: String(gm?.stolenBases ?? 0),
            },
          };
        })}
      />
    </>
  );
}
