import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  deletePlateAppearance,
  updatePlateAppearance,
} from "@/app/(private)/admin/_actions/plate-appearance";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import {
  getGameMembers,
  getGameOfEvent,
  getPlateAppearance,
} from "@/app/(private)/admin/_data/game";
import { parseId } from "@/app/(private)/admin/_utils/id";
import { PlateAppearanceForm } from "@/app/(private)/admin/events/[id]/_components/plate-appearance-form";

export const metadata: Metadata = {
  title: "打席結果を編集",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; paId: string }>;
}) {
  const { id, paId } = await params;
  const eventId = parseId(id);
  const plateAppearanceId = parseId(paId);
  const game = await getGameOfEvent(eventId);
  if (!game) notFound();
  const [pa, gameMembers] = await Promise.all([
    getPlateAppearance(game.id, plateAppearanceId),
    getGameMembers(game.id),
  ]);
  if (!pa) notFound();

  return (
    <>
      <PageHeader
        title="打席結果を編集"
        backHref={`/admin/events/${eventId}/at-bats`}
      />
      <PlateAppearanceForm
        action={updatePlateAppearance.bind(null, eventId, plateAppearanceId)}
        gameMembers={gameMembers.map((gm) => ({
          value: String(gm.id),
          label: `#${gm.member.uniformNumber} ${gm.member.name}`,
        }))}
        initial={{
          gameMemberId: String(pa.gameMemberId),
          inningNumber: String(pa.inningNumber),
          atBatInGame: String(pa.atBatInGame),
          result: pa.result,
          direction: pa.direction ?? "",
          rbi: String(pa.rbi),
          isScoringPosition: pa.isScoringPosition,
        }}
        deleteTarget={{
          name: `第${pa.atBatInGame}打席`,
          action: deletePlateAppearance.bind(null, eventId, plateAppearanceId),
        }}
      />
    </>
  );
}
