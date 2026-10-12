import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  atBatResultFullLabel,
  positionFullLabel,
} from "@/app/_constants/labels";
import { EmptyState } from "@/app/(private)/admin/_components/empty-state";
import { ListCard } from "@/app/(private)/admin/_components/list-card";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import {
  getGameOfEvent,
  getPlateAppearances,
} from "@/app/(private)/admin/_data/game";
import { parseId } from "@/app/(private)/admin/_utils/id";

export const metadata: Metadata = {
  title: "打席の結果",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const eventId = parseId((await params).id);
  const game = await getGameOfEvent(eventId);
  if (!game) notFound();
  const rows = await getPlateAppearances(game.id);

  return (
    <>
      <PageHeader
        title="打席の結果"
        backHref={`/admin/events/${eventId}`}
        addHref={`/admin/events/${eventId}/at-bats/new`}
      />
      {rows.length === 0 ? (
        <EmptyState message="打席の結果がまだ登録されていません" />
      ) : (
        <ul>
          {rows.map((r) => (
            <ListCard
              key={r.id}
              href={`/admin/events/${eventId}/at-bats/${r.id}`}
              title={`#${r.gameMember.member.uniformNumber} ${r.gameMember.member.name} 第${r.atBatInGame}打席`}
              description={[
                `${r.inningNumber}回`,
                atBatResultFullLabel[r.result],
                r.direction && positionFullLabel[r.direction],
                r.rbi > 0 && `${r.rbi}打点`,
              ]
                .filter(Boolean)
                .join(" / ")}
            />
          ))}
        </ul>
      )}
    </>
  );
}
