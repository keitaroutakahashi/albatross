import type { Metadata } from "next";
import { Badge } from "@/app/(private)/admin/_components/badge";
import { EmptyState } from "@/app/(private)/admin/_components/empty-state";
import { ListCard } from "@/app/(private)/admin/_components/list-card";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import { getOpponentList } from "@/app/(private)/admin/_data/opponent";

export const metadata: Metadata = {
  title: "対戦相手",
};

export default async function Page() {
  const rows = await getOpponentList();

  return (
    <>
      <PageHeader
        title="対戦相手"
        backHref="/admin"
        addHref="/admin/opponents/new"
      />
      {rows.length === 0 ? (
        <EmptyState message="対戦相手がまだ登録されていません" />
      ) : (
        <ul>
          {rows.map((r) => (
            <ListCard
              key={r.id}
              href={`/admin/opponents/${r.id}`}
              title={r.name}
              trailing={<Badge tone="muted">{`${r._count.games}試合`}</Badge>}
            />
          ))}
        </ul>
      )}
    </>
  );
}
