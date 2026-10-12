import { Badge } from "@/app/(private)/admin/_components/badge";
import { ListCard } from "@/app/(private)/admin/_components/list-card";

type Props = {
  eventId: number;
  type: "game" | "practice";
  counts: {
    innings: number;
    gameMembers: number;
    plateAppearances: number;
    pitchingResults: number;
    practiceMembers: number;
  };
};

/** イベントに紐づく、試合・練習の詳細データへの入口 */
export const RelatedLinks = ({ eventId, type, counts }: Props) => {
  const base = `/admin/events/${eventId}` as const;
  const count = (n: number) => <Badge tone="muted">{`${n}件`}</Badge>;

  return (
    <section className="border-b">
      <h2 className="px-4 pt-4 pb-2 text-sm font-bold text-muted-foreground">
        関連データ
      </h2>
      <ul className="border-t">
        {type === "practice" ? (
          <ListCard
            href={`${base}/members`}
            title="参加メンバー"
            trailing={count(counts.practiceMembers)}
          />
        ) : (
          <>
            <ListCard
              href={`${base}/innings`}
              title="イニング得点"
              trailing={count(counts.innings)}
            />
            <ListCard
              href={`${base}/lineup`}
              title="出場メンバー"
              trailing={count(counts.gameMembers)}
            />
            <ListCard
              href={`${base}/at-bats`}
              title="打席結果"
              trailing={count(counts.plateAppearances)}
            />
            <ListCard
              href={`${base}/pitching`}
              title="投手成績"
              trailing={count(counts.pitchingResults)}
            />
          </>
        )}
      </ul>
    </section>
  );
};
