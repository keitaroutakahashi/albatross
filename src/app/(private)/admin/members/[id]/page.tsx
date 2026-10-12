import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  deleteMember,
  updateMember,
} from "@/app/(private)/admin/_actions/member";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import { getMember } from "@/app/(private)/admin/_data/member";
import { parseId } from "@/app/(private)/admin/_utils/id";
import { MemberForm } from "@/app/(private)/admin/members/_components/member-form";

export const metadata: Metadata = {
  title: "メンバーを編集",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = parseId((await params).id);
  const item = await getMember(id);
  if (!item) notFound();

  return (
    <>
      <PageHeader title="メンバーを編集" backHref="/admin/members" />
      <MemberForm
        action={updateMember.bind(null, id)}
        initial={item}
        deleteTarget={{
          name: item.name,
          action: deleteMember.bind(null, id),
        }}
      />
    </>
  );
}
