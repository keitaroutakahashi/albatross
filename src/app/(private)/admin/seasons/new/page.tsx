import type { Metadata } from "next";
import { createSeason } from "@/app/(private)/admin/_actions/season";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import { SeasonForm } from "@/app/(private)/admin/seasons/_components/season-form";

export const metadata: Metadata = {
  title: "シーズンを追加",
};

export default function Page() {
  return (
    <>
      <PageHeader title="シーズンを追加" backHref="/admin/seasons" />
      <SeasonForm action={createSeason} />
    </>
  );
}
