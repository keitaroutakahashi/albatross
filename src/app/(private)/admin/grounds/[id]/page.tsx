import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  deleteGround,
  updateGround,
} from "@/app/(private)/admin/_actions/ground";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import { getGround } from "@/app/(private)/admin/_data/ground";
import { parseId } from "@/app/(private)/admin/_utils/id";
import { GroundForm } from "@/app/(private)/admin/grounds/_components/ground-form";

export const metadata: Metadata = {
  title: "グラウンドを編集",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = parseId((await params).id);
  const item = await getGround(id);
  if (!item) notFound();

  return (
    <>
      <PageHeader title="グラウンドを編集" backHref="/admin/grounds" />
      <GroundForm
        action={updateGround.bind(null, id)}
        initial={item}
        deleteTarget={{
          name: item.name,
          action: deleteGround.bind(null, id),
        }}
      />
    </>
  );
}
