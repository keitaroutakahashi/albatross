import type { Metadata } from "next";
import { createLeague } from "@/app/(private)/admin/_actions/league";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import { LeagueForm } from "@/app/(private)/admin/leagues/_components/league-form";

export const metadata: Metadata = {
  title: "リーグを追加",
};

export default function Page() {
  return (
    <>
      <PageHeader title="リーグを追加" backHref="/admin/leagues" />
      <LeagueForm action={createLeague} />
    </>
  );
}
