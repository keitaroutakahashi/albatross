import type { Metadata } from "next";
import {
  handLabel,
  memberCategoryLabel,
  positionFullLabel,
} from "@/app/_constants/labels";
import { Badge } from "@/app/(private)/admin/_components/badge";
import { EmptyState } from "@/app/(private)/admin/_components/empty-state";
import { ListCard } from "@/app/(private)/admin/_components/list-card";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import { getMemberList } from "@/app/(private)/admin/_data/member";

export const metadata: Metadata = {
  title: "メンバー",
};

export default async function Page() {
  const rows = await getMemberList();

  return (
    <>
      <PageHeader
        title="メンバー"
        backHref="/admin"
        addHref="/admin/members/new"
      />
      {rows.length === 0 ? (
        <EmptyState message="メンバーがまだ登録されていません" />
      ) : (
        <ul>
          {rows.map((r) => (
            <ListCard
              key={r.id}
              href={`/admin/members/${r.id}`}
              title={`#${r.uniformNumber} ${r.name}`}
              description={`${positionFullLabel[r.position]} / ${handLabel[r.throwHand]}投${handLabel[r.batHand]}打`}
              trailing={
                r.isActive ? (
                  r.category === "guest" ? (
                    <Badge>{memberCategoryLabel.guest}</Badge>
                  ) : undefined
                ) : (
                  <Badge tone="muted">非現役</Badge>
                )
              }
            />
          ))}
        </ul>
      )}
    </>
  );
}
