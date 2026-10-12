import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPlateAppearance } from "@/app/(private)/admin/_actions/plate-appearance";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import {
  getGameMembers,
  getGameOfEvent,
} from "@/app/(private)/admin/_data/game";
import { parseId } from "@/app/(private)/admin/_utils/id";
import { PlateAppearanceForm } from "@/app/(private)/admin/events/[id]/_components/plate-appearance-form";

export const metadata: Metadata = {
  title: "打席結果を追加",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const eventId = parseId((await params).id);
  const game = await getGameOfEvent(eventId);
  if (!game) notFound();
  const gameMembers = await getGameMembers(game.id);

  return (
    <>
      <PageHeader
        title="打席結果を追加"
        backHref={`/admin/events/${eventId}/at-bats`}
      />
      <PlateAppearanceForm
        action={createPlateAppearance.bind(null, eventId)}
        gameMembers={gameMembers.map((gm) => ({
          value: String(gm.id),
          label: `#${gm.member.uniformNumber} ${gm.member.name}`,
        }))}
      />
    </>
  );
}
