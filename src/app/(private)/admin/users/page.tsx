import type { Metadata } from "next";
import { userRoleLabel } from "@/app/_constants/labels";
import { Badge } from "@/app/(private)/admin/_components/badge";
import { EmptyState } from "@/app/(private)/admin/_components/empty-state";
import { ListCard } from "@/app/(private)/admin/_components/list-card";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import { getUserList } from "@/app/(private)/admin/_data/user";

export const metadata: Metadata = {
  title: "ユーザー",
};

export default async function Page() {
  const rows = await getUserList();

  return (
    <>
      <PageHeader
        title="ユーザー"
        backHref="/admin"
        addHref="/admin/users/new"
      />
      {rows.length === 0 ? (
        <EmptyState message="ユーザーがまだ登録されていません" />
      ) : (
        <ul>
          {rows.map((r) => (
            <ListCard
              key={r.id}
              href={`/admin/users/${r.id}`}
              title={r.name ?? r.email}
              description={r.name ? r.email : undefined}
              trailing={
                <Badge tone={r.role === "admin" ? "default" : "muted"}>
                  {userRoleLabel[r.role]}
                </Badge>
              }
            />
          ))}
        </ul>
      )}
    </>
  );
}
