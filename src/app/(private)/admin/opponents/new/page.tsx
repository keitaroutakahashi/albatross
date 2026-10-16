import type { Metadata } from "next";
import { createOpponent } from "@/app/(private)/admin/_actions/opponent";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import { OpponentForm } from "@/app/(private)/admin/opponents/_components/opponent-form";

export const metadata: Metadata = {
  title: "対戦相手を追加",
};

export default function Page() {
  return (
    <>
      <PageHeader title="対戦相手を追加" backHref="/admin/opponents" />
      <OpponentForm action={createOpponent} />
    </>
  );
}
