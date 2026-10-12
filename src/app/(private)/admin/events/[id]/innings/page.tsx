import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { saveInnings } from "@/app/(private)/admin/_actions/inning";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import { getGameOfEvent, getInnings } from "@/app/(private)/admin/_data/game";
import { parseId } from "@/app/(private)/admin/_utils/id";
import { InningsForm } from "@/app/(private)/admin/events/[id]/_components/innings-form";

export const metadata: Metadata = {
  title: "イニングごとの得点",
};

/** イニングが未登録のときに最初に並べる回数（草野球は 7 回制が多い） */
const DEFAULT_INNINGS = 7;

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const eventId = parseId((await params).id);
  const game = await getGameOfEvent(eventId);
  if (!game) notFound();
  const innings = await getInnings(game.id);

  const initial =
    innings.length > 0
      ? innings.map((i) => ({
          teamScore: String(i.teamScore),
          opponentScore: String(i.opponentScore),
        }))
      : Array.from({ length: DEFAULT_INNINGS }, () => ({
          teamScore: "0",
          opponentScore: "0",
        }));

  return (
    <>
      <PageHeader
        title="イニングごとの得点"
        backHref={`/admin/events/${eventId}`}
      />
      <InningsForm
        action={saveInnings.bind(null, eventId)}
        initial={initial}
        isFirstBatting={game.isFirstBatting}
      />
    </>
  );
}
