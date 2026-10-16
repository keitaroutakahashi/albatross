import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  deleteUser,
  issueUserInvitation,
  updateUser,
} from "@/app/(private)/admin/_actions/user";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import { getLinkableMembers, getUser } from "@/app/(private)/admin/_data/user";
import { parseId } from "@/app/(private)/admin/_utils/id";
import { InvitationPanel } from "@/app/(private)/admin/users/_components/invitation-panel";
import { UserForm } from "@/app/(private)/admin/users/_components/user-form";
import { canSignIn } from "@/lib/auth/policy";

export const metadata: Metadata = {
  title: "ユーザーを編集",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = parseId((await params).id);
  const [item, members] = await Promise.all([
    getUser(id),
    getLinkableMembers(id),
  ]);
  if (!item) notFound();

  return (
    <>
      <PageHeader title="ユーザーを編集" backHref="/admin/users" />
      <InvitationPanel
        canSignIn={canSignIn(item.role)}
        passkeyCount={item._count.passkeys}
        issue={issueUserInvitation.bind(null, id)}
      />
      <UserForm
        action={updateUser.bind(null, id)}
        initial={item}
        members={members}
        deleteTarget={{
          name: item.name ?? item.email,
          action: deleteUser.bind(null, id),
        }}
      />
    </>
  );
}
