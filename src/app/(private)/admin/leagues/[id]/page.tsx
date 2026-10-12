import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  deleteLeague,
  updateLeague,
} from "@/app/(private)/admin/_actions/league";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import { getLeague } from "@/app/(private)/admin/_data/league";
import { parseId } from "@/app/(private)/admin/_utils/id";
import { LeagueForm } from "@/app/(private)/admin/leagues/_components/league-form";

export const metadata: Metadata = {
  title: "リーグを編集",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = parseId((await params).id);
  const item = await getLeague(id);
  if (!item) notFound();

  return (
    <>
      <PageHeader title="リーグを編集" backHref="/admin/leagues" />
      <LeagueForm
        action={updateLeague.bind(null, id)}
        initial={item}
        deleteTarget={{
          name: item.name,
          action: deleteLeague.bind(null, id),
        }}
      />
    </>
  );
}
