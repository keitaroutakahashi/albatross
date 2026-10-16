import type { Metadata } from "next";
import { createMember } from "@/app/(private)/admin/_actions/member";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import { MemberForm } from "@/app/(private)/admin/members/_components/member-form";

export const metadata: Metadata = {
  title: "メンバーを追加",
};

export default function Page() {
  return (
    <>
      <PageHeader title="メンバーを追加" backHref="/admin/members" />
      <MemberForm action={createMember} />
    </>
  );
}
