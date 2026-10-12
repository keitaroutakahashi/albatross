import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { saveLineup } from "@/app/(private)/admin/_actions/lineup";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import {
  getGameOfEvent,
  getLineupCandidates,
} from "@/app/(private)/admin/_data/game";
import { MAX_STARTERS } from "@/app/(private)/admin/_schemas/lineup";
import { parseId } from "@/app/(private)/admin/_utils/id";
import { LineupForm } from "@/app/(private)/admin/events/[id]/_components/lineup-form";

export const metadata: Metadata = {
  title: "出場した選手",
};

/** 打順が未登録のときに最初に並べる行数 */
const DEFAULT_STARTERS = 9;

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const eventId = parseId((await params).id);
  const game = await getGameOfEvent(eventId);
  if (!game) notFound();
  const { members, gameMembers } = await getLineupCandidates(game.id);

  // 打順 N の選手を N 行目に置く。打順が未設定・重複のスタメンは空いている行へ
  const starters = gameMembers.filter((gm) => gm.memberType === "starting");
  const rows: { memberId: string; position: string }[] = [];
  const unplaced = [];
  for (const gm of starters) {
    const index = (gm.battingOrder ?? 0) - 1;
    if (index >= 0 && index < MAX_STARTERS && !rows[index]) {
      rows[index] = {
        memberId: String(gm.memberId),
        position: gm.position ?? "",
      };
    } else {
      unplaced.push(gm);
    }
  }
  for (const gm of unplaced) {
    let index = 0;
    while (rows[index]) index++;
    rows[index] = {
      memberId: String(gm.memberId),
      position: gm.position ?? "",
    };
  }
  const rowCount = Math.min(
    MAX_STARTERS,
    Math.max(DEFAULT_STARTERS, rows.length),
  );
  const initialStarters = Array.from(
    { length: rowCount },
    (_, i) => rows[i] ?? { memberId: "", position: "" },
  );

  return (
    <>
      <PageHeader title="出場した選手" backHref={`/admin/events/${eventId}`} />
      <LineupForm
        action={saveLineup.bind(null, eventId)}
        members={members.map((m) => ({
          value: String(m.id),
          label: `${m.name} #${m.uniformNumber}`,
        }))}
        initialStarters={initialStarters}
        initialBench={gameMembers
          .filter((gm) => gm.memberType === "bench")
          .map((gm) => String(gm.memberId))}
      />
    </>
  );
}
