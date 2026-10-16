import type { Metadata } from "next";
import { formatSeason } from "@/app/_utils/season";
import { createEvent } from "@/app/(private)/admin/_actions/event";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import { getEventSeasons } from "@/app/(private)/admin/_data/event";
import { EventCreateForm } from "@/app/(private)/admin/events/_components/event-create-form";

export const metadata: Metadata = {
  title: "イベントを登録",
};

export default async function Page() {
  const seasons = await getEventSeasons();

  return (
    <>
      <PageHeader title="イベントを登録" backHref="/admin/events" />
      <EventCreateForm
        action={createEvent}
        seasons={seasons.map((s) => ({
          value: String(s.id),
          label: formatSeason(s.season),
        }))}
      />
    </>
  );
}
