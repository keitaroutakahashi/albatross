import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatMemberLabel } from "@/app/_utils/uniform-number";
import { createPitchingResult } from "@/app/(private)/admin/_actions/pitching-result";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import {
  getGameMembers,
  getGameOfEvent,
  getNextPitchingOrder,
} from "@/app/(private)/admin/_data/game";
import { parseId } from "@/app/(private)/admin/_utils/id";
import { LineupRequiredNotice } from "@/app/(private)/admin/events/[id]/_components/lineup-required-notice";
import { PitchingResultForm } from "@/app/(private)/admin/events/[id]/_components/pitching-result-form";

export const metadata: Metadata = {
  title: "投手の成績を追加",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const eventId = parseId((await params).id);
  const game = await getGameOfEvent(eventId);
  if (!game) notFound();
  const [gameMembers, nextPitchingOrder] = await Promise.all([
    getGameMembers(game.id),
    getNextPitchingOrder(game.id),
  ]);

  if (gameMembers.length === 0) {
    return (
      <>
        <PageHeader
          title="投手の成績を追加"
          backHref={`/admin/events/${eventId}/pitching`}
        />
        <LineupRequiredNotice eventId={eventId} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="投手の成績を追加"
        backHref={`/admin/events/${eventId}/pitching`}
      />
      <PitchingResultForm
        action={createPitchingResult.bind(null, eventId)}
        defaultPitchingOrder={String(nextPitchingOrder)}
        gameResult={game.result}
        // 投手の成績は 1 人 1 件のため、登録済みの選手は選べない
        gameMembers={gameMembers
          .filter((gm) => gm.pitchingResult === null)
          .map((gm) => ({
            value: String(gm.id),
            label: formatMemberLabel(gm.member),
          }))}
      />
    </>
  );
}
