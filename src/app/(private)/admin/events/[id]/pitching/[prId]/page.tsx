import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatMemberLabel } from "@/app/_utils/uniform-number";
import {
  deletePitchingResult,
  updatePitchingResult,
} from "@/app/(private)/admin/_actions/pitching-result";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import {
  getGameMembers,
  getGameOfEvent,
  getPitchingResult,
} from "@/app/(private)/admin/_data/game";
import { parseId } from "@/app/(private)/admin/_utils/id";
import { sortMembersForSelect } from "@/app/(private)/admin/_utils/member-order";
import { PitchingResultForm } from "@/app/(private)/admin/events/[id]/_components/pitching-result-form";

export const metadata: Metadata = {
  title: "投手の成績を編集",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; prId: string }>;
}) {
  const { id, prId } = await params;
  const eventId = parseId(id);
  const pitchingResultId = parseId(prId);
  const game = await getGameOfEvent(eventId);
  if (!game) notFound();
  const [result, gameMembers] = await Promise.all([
    getPitchingResult(game.id, pitchingResultId),
    getGameMembers(game.id),
  ]);
  if (!result) notFound();

  const str = (value: number | null) => (value === null ? "" : String(value));

  return (
    <>
      <PageHeader
        title="投手の成績を編集"
        backHref={`/admin/events/${eventId}/pitching`}
      />
      <PitchingResultForm
        action={updatePitchingResult.bind(null, eventId, pitchingResultId)}
        gameResult={game.result}
        // 投手の成績は 1 人 1 件のため、他の投手の登録済み選手は選べない
        gameMembers={sortMembersForSelect(
          gameMembers
            .filter(
              (gm) =>
                gm.pitchingResult === null || gm.id === result.gameMemberId,
            )
            .map((gm) => ({ ...gm.member, gameMemberId: gm.id })),
        ).map((m) => ({
          value: String(m.gameMemberId),
          label: formatMemberLabel(m),
        }))}
        initial={{
          gameMemberId: String(result.gameMemberId),
          pitchingOrder: String(result.pitchingOrder),
          inningsPitched: String(result.inningsPitched),
          partialOuts: str(result.partialOuts),
          earnedRuns: String(result.earnedRuns),
          runs: String(result.runs),
          strikeouts: String(result.strikeouts),
          walks: String(result.walks),
          hitByPitches: String(result.hitByPitches),
          hitsAllowed: String(result.hitsAllowed),
          homeRunsAllowed: String(result.homeRunsAllowed),
          pitchCount: str(result.pitchCount),
          isResponsible: result.isResponsible,
        }}
        deleteTarget={{
          name: "この投手の成績",
          action: deletePitchingResult.bind(null, eventId, pitchingResultId),
        }}
      />
    </>
  );
}
