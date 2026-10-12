import type { Metadata } from "next";
import { EmptyState } from "@/app/(private)/admin/_components/empty-state";
import { ListCard } from "@/app/(private)/admin/_components/list-card";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import { getGroundList } from "@/app/(private)/admin/_data/ground";

export const metadata: Metadata = {
  title: "グラウンド",
};

export default async function Page() {
  const rows = await getGroundList();

  return (
    <>
      <PageHeader
        title="グラウンド"
        backHref="/admin"
        addHref="/admin/grounds/new"
      />
      {rows.length === 0 ? (
        <EmptyState message="グラウンドがまだ登録されていません" />
      ) : (
        <ul>
          {rows.map((r) => (
            <ListCard
              key={r.id}
              href={`/admin/grounds/${r.id}`}
              title={r.name}
              description={r.address}
            />
          ))}
        </ul>
      )}
    </>
  );
}
