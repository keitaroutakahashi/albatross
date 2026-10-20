import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { positionFullLabel } from "@/app/_constants/labels";
import { savePlateAppearances } from "@/app/(private)/admin/_actions/plate-appearance";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import {
  getGameMemberWithAtBats,
  getGameOfEvent,
} from "@/app/(private)/admin/_data/game";
import { parseId } from "@/app/(private)/admin/_utils/id";
import {
  type AtBatRowInitial,
  PlateAppearancesForm,
} from "@/app/(private)/admin/events/[id]/_components/plate-appearances-form";

export const metadata: Metadata = {
  title: "打席の入力",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; gameMemberId: string }>;
}) {
  const { id, gameMemberId: rawGameMemberId } = await params;
  const eventId = parseId(id);
  const gameMemberId = parseId(rawGameMemberId);
  const game = await getGameOfEvent(eventId);
  if (!game) notFound();
  const gameMember = await getGameMemberWithAtBats(game.id, gameMemberId);
  if (!gameMember) notFound();

  // 打席番号 N の打席を N 行目に置く。未登録の打席は空の行にする
  const lastNumber = gameMember.plateAppearances.at(-1)?.atBatInGame ?? 0;
  const initialRows: AtBatRowInitial[] = Array.from(
    { length: lastNumber },
    () => ({
      inningNumber: "",
      result: "",
      direction: "",
      rbi: "0",
      isScoringPosition: false,
    }),
  );
  for (const pa of gameMember.plateAppearances) {
    initialRows[pa.atBatInGame - 1] = {
      inningNumber: String(pa.inningNumber),
      result: pa.result,
      direction: pa.direction ?? "",
      rbi: String(pa.rbi),
      isScoringPosition: pa.isScoringPosition,
    };
  }

  const { member } = gameMember;
  const profile = [
    `#${member.uniformNumber}`,
    gameMember.battingOrder !== null && `${gameMember.battingOrder}番`,
    gameMember.position && positionFullLabel[gameMember.position],
    gameMember.memberType === "bench" && "ベンチ",
  ]
    .filter(Boolean)
    .join(" / ");

  return (
    <>
      <PageHeader
        title={member.name}
        backHref={`/admin/events/${eventId}/at-bats`}
      />
      <p className="px-4 pt-3 text-sm text-muted-foreground">{profile}</p>
      <PlateAppearancesForm
        action={savePlateAppearances.bind(null, eventId, gameMemberId)}
        initialRows={initialRows}
        initialStolenBases={gameMember.stolenBases}
      />
    </>
  );
}
