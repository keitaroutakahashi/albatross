import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  deleteOpponent,
  updateOpponent,
} from "@/app/(private)/admin/_actions/opponent";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import { getOpponent } from "@/app/(private)/admin/_data/opponent";
import { parseId } from "@/app/(private)/admin/_utils/id";
import { OpponentForm } from "@/app/(private)/admin/opponents/_components/opponent-form";

export const metadata: Metadata = {
  title: "対戦相手を編集",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = parseId((await params).id);
  const item = await getOpponent(id);
  if (!item) notFound();

  return (
    <>
      <PageHeader title="対戦相手を編集" backHref="/admin/opponents" />
      <OpponentForm
        action={updateOpponent.bind(null, id)}
        initial={item}
        deleteTarget={{
          name: item.name,
          action: deleteOpponent.bind(null, id),
        }}
      />
    </>
  );
}
