import type { Metadata } from "next";
import { createGround } from "@/app/(private)/admin/_actions/ground";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import { GroundForm } from "@/app/(private)/admin/grounds/_components/ground-form";

export const metadata: Metadata = {
  title: "グラウンドを追加",
};

export default function Page() {
  return (
    <>
      <PageHeader title="グラウンドを追加" backHref="/admin/grounds" />
      <GroundForm action={createGround} />
    </>
  );
}
