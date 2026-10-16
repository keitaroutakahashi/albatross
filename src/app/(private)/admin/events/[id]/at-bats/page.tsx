import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { positionLabel } from "@/app/_constants/labels";
import { formatAtBatResult } from "@/app/_features/games/utils/at-bat-result";
import { Badge } from "@/app/(private)/admin/_components/badge";
import { ListCard } from "@/app/(private)/admin/_components/list-card";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import {
  getGameOfEvent,
  getLineupWithAtBats,
} from "@/app/(private)/admin/_data/game";
import { parseId } from "@/app/(private)/admin/_utils/id";
import { LineupRequiredNotice } from "@/app/(private)/admin/events/[id]/_components/lineup-required-notice";

export const metadata: Metadata = {
  title: "打席の結果",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const eventId = parseId((await params).id);
  const game = await getGameOfEvent(eventId);
  if (!game) notFound();
  const gameMembers = await getLineupWithAtBats(game.id);

  const header = (
    <PageHeader title="打席の結果" backHref={`/admin/events/${eventId}`} />
  );

  if (gameMembers.length === 0) {
    return (
      <>
        {header}
        <LineupRequiredNotice eventId={eventId} />
      </>
    );
  }

  const groups = [
    {
      title: "スタメン",
      members: gameMembers.filter((gm) => gm.memberType === "starting"),
    },
    {
      title: "ベンチ",
      members: gameMembers.filter((gm) => gm.memberType === "bench"),
    },
  ].filter((group) => group.members.length > 0);

  return (
    <>
      {header}
      {groups.map((group) => (
        <section key={group.title}>
          <h2 className="px-4 pt-4 pb-2 text-base font-bold">{group.title}</h2>
          <ul className="border-t">
            {group.members.map((gm) => {
              const count = gm.plateAppearances.length;
              return (
                <ListCard
                  key={gm.id}
                  href={`/admin/events/${eventId}/at-bats/${gm.id}`}
                  title={
                    <span className="flex items-center gap-2">
                      <span className="min-w-0 truncate">
                        {gm.battingOrder !== null && `${gm.battingOrder}. `}#
                        {gm.member.uniformNumber} {gm.member.name}
                      </span>
                      {gm.position && (
                        <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                          {positionLabel[gm.position]}
                        </span>
                      )}
                    </span>
                  }
                  description={
                    count === 0
                      ? "打席なし"
                      : gm.plateAppearances
                          .map((pa) =>
                            formatAtBatResult(pa.result, pa.direction),
                          )
                          .join("・")
                  }
                  trailing={
                    <Badge tone={count === 0 ? "muted" : "default"}>
                      {count === 0 ? "未登録" : `${count}打席`}
                    </Badge>
                  }
                />
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}
