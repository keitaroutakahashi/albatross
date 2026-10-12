import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  deleteSeason,
  updateSeason,
} from "@/app/(private)/admin/_actions/season";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import { getSeason } from "@/app/(private)/admin/_data/season";
import { parseId } from "@/app/(private)/admin/_utils/id";
import { SeasonForm } from "@/app/(private)/admin/seasons/_components/season-form";

export const metadata: Metadata = {
  title: "シーズンを編集",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = parseId((await params).id);
  const item = await getSeason(id);
  if (!item) notFound();

  return (
    <>
      <PageHeader title="シーズンを編集" backHref="/admin/seasons" />
      <SeasonForm
        action={updateSeason.bind(null, id)}
        initial={item}
        deleteTarget={{
          name: `${item.season}年度`,
          action: deleteSeason.bind(null, id),
        }}
      />
    </>
  );
}
