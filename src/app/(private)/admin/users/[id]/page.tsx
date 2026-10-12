import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { deleteUser, updateUser } from "@/app/(private)/admin/_actions/user";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import { getUser } from "@/app/(private)/admin/_data/user";
import { parseId } from "@/app/(private)/admin/_utils/id";
import { UserForm } from "@/app/(private)/admin/users/_components/user-form";

export const metadata: Metadata = {
  title: "ユーザーを編集",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = parseId((await params).id);
  const item = await getUser(id);
  if (!item) notFound();

  return (
    <>
      <PageHeader title="ユーザーを編集" backHref="/admin/users" />
      <UserForm
        action={updateUser.bind(null, id)}
        initial={item}
        deleteTarget={{
          name: item.name ?? item.email,
          action: deleteUser.bind(null, id),
        }}
      />
    </>
  );
}
