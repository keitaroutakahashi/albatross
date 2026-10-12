import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pitchingDecisionLabel } from "@/app/_constants/labels";
import { Badge } from "@/app/(private)/admin/_components/badge";
import { EmptyState } from "@/app/(private)/admin/_components/empty-state";
import { ListCard } from "@/app/(private)/admin/_components/list-card";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import {
  getGameOfEvent,
  getPitchingResults,
} from "@/app/(private)/admin/_data/game";
import { parseId } from "@/app/(private)/admin/_utils/id";

export const metadata: Metadata = {
  title: "投手成績",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const eventId = parseId((await params).id);
  const game = await getGameOfEvent(eventId);
  if (!game) notFound();
  const rows = await getPitchingResults(game.id);

  return (
    <>
      <PageHeader
        title="投手成績"
        backHref={`/admin/events/${eventId}`}
        addHref={`/admin/events/${eventId}/pitching/new`}
      />
      {rows.length === 0 ? (
        <EmptyState message="投手成績がまだ登録されていません" />
      ) : (
        <ul>
          {rows.map((r) => (
            <ListCard
              key={r.id}
              href={`/admin/events/${eventId}/pitching/${r.id}`}
              title={`${r.pitchingOrder}. #${r.gameMember.member.uniformNumber} ${r.gameMember.member.name}`}
              description={`${r.inningsPitched}${r.partialOuts ? ` ${r.partialOuts}/3` : ""}回 / 失点${r.runs} / 奪三振${r.strikeouts}`}
              trailing={
                r.decision ? (
                  <Badge>{pitchingDecisionLabel[r.decision]}</Badge>
                ) : undefined
              }
            />
          ))}
        </ul>
      )}
    </>
  );
}
