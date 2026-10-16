import type { Metadata } from "next";
import { createUser } from "@/app/(private)/admin/_actions/user";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import { getLinkableMembers } from "@/app/(private)/admin/_data/user";
import { UserForm } from "@/app/(private)/admin/users/_components/user-form";

export const metadata: Metadata = {
  title: "ユーザーを追加",
};

export default async function Page() {
  const members = await getLinkableMembers();

  return (
    <>
      <PageHeader title="ユーザーを追加" backHref="/admin/users" />
      <UserForm action={createUser} members={members} />
    </>
  );
}
