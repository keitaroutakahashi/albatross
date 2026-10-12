import type { Metadata } from "next";
import { createEvent } from "@/app/(private)/admin/_actions/event";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import { getEventFormOptions } from "@/app/(private)/admin/_data/event";
import { EventForm } from "@/app/(private)/admin/events/_components/event-form";

export const metadata: Metadata = {
  title: "イベントを追加",
};

export default async function Page() {
  const options = await getEventFormOptions();

  return (
    <>
      <PageHeader title="イベントを追加" backHref="/admin/events" />
      <EventForm action={createEvent} options={options} />
    </>
  );
}
