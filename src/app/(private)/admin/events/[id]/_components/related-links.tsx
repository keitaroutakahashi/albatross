import { Badge } from "@/app/(private)/admin/_components/badge";
import { ListCard } from "@/app/(private)/admin/_components/list-card";

type Props = {
  eventId: number;
  type: "game" | "practice";
  /** 基本情報の入口に添える要約（日時など） */
  summary: string;
  counts: {
    innings: number;
    gameMembers: number;
    plateAppearances: number;
    pitchingResults: number;
    practiceMembers: number;
  };
};

/** イベントの詳しい記録を入力するための入口 */
export const RelatedLinks = ({ eventId, type, summary, counts }: Props) => {
  const base = `/admin/events/${eventId}` as const;
  const count = (n: number, unit: string) => (
    <Badge tone="muted">{n === 0 ? "未登録" : `${n}${unit}`}</Badge>
  );

  return (
    <>
      <ul className="border-b">
        <ListCard
          href={`${base}/basic`}
          title="基本情報"
          description={summary}
        />
      </ul>
      <section className="border-b pb-2">
        <h2 className="px-4 pt-4 pb-2 text-base font-bold">
          {type === "game" ? "試合の詳しい記録" : "練習の参加者"}
        </h2>
        {type === "game" && (
          <p className="px-4 pt-1 pb-3 text-sm text-muted-foreground">
            上から順に入力します。
          </p>
        )}
        <ul className="border-y">
          {type === "practice" ? (
            <ListCard
              href={`${base}/members`}
              title="参加した人を選ぶ"
              trailing={count(counts.practiceMembers, "人")}
            />
          ) : (
            <>
              <ListCard
                href={`${base}/lineup`}
                title="1. 出場した選手"
                trailing={count(counts.gameMembers, "人")}
              />
              <ListCard
                href={`${base}/innings`}
                title="2. イニングごとの得点"
                trailing={count(counts.innings, "回")}
              />
              <ListCard
                href={`${base}/at-bats`}
                title="3. 打席の結果"
                trailing={count(counts.plateAppearances, "打席")}
              />
              <ListCard
                href={`${base}/pitching`}
                title="4. 投手の成績"
                trailing={count(counts.pitchingResults, "人")}
              />
            </>
          )}
        </ul>
      </section>
    </>
  );
};
