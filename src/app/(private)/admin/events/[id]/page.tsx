import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { gameResultLabel } from "@/app/_constants/labels";
import {
  formatJstDateTimeWithDay,
  isOnOrAfterJstDay,
} from "@/app/_utils/date/date";
import { deleteEvent } from "@/app/(private)/admin/_actions/event";
import { DeleteButton } from "@/app/(private)/admin/_components/delete-button";
import { OverdueMark } from "@/app/(private)/admin/_components/overdue-mark";
import { PageHeader } from "@/app/(private)/admin/_components/page-header";
import { getEvent } from "@/app/(private)/admin/_data/event";
import { getGameRelatedCounts } from "@/app/(private)/admin/_data/game";
import {
  describeMatchup,
  describeReview,
  describeSchedule,
  formatGameScore,
} from "@/app/(private)/admin/_utils/event-display";
import {
  buildGameSteps,
  buildPracticeSteps,
} from "@/app/(private)/admin/_utils/event-progress";
import { parseId } from "@/app/(private)/admin/_utils/id";
import { EventResultSummary } from "@/app/(private)/admin/events/_components/event-result-summary";
import { EventTypeTag } from "@/app/(private)/admin/events/_components/event-type-tag";
import { EventStatusControl } from "@/app/(private)/admin/events/[id]/_components/event-status-control";
import { EventSteps } from "@/app/(private)/admin/events/[id]/_components/event-steps";

export const metadata: Metadata = {
  title: "イベント",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = parseId((await params).id);
  const event = await getEvent(id);
  if (!event) notFound();

  const game = event.game;
  const gameCounts = game ? await getGameRelatedCounts(game.id) : null;
  const groundName = game ? game.ground?.name : event.practice?.ground?.name;
  const score = game ? formatGameScore(game) : null;
  const schedule = {
    done: groundName != null,
    text: describeSchedule({
      season: event.season.season,
      groundName: groundName ?? null,
      groundCourt: game
        ? game.groundCourt
        : (event.practice?.groundCourt ?? null),
      note: event.note,
    }),
  };
  const reviewText = game
    ? describeReview({
        ...game,
        weather: game.gameWeather?.weather ?? null,
        temperature: game.gameWeather?.temperature ?? null,
        mvpCount: game.mvps.length,
      })
    : "";
  const steps =
    game && gameCounts
      ? buildGameSteps(gameCounts, {
          schedule,
          matchup: {
            done: game.opponent !== null,
            text: describeMatchup({
              opponentName: game.opponent?.name ?? null,
              leagueName: game.league?.name ?? null,
              gameType: game.gameType,
              isFirstBatting: game.isFirstBatting,
            }),
          },
          review: { done: reviewText !== "", text: reviewText },
        })
      : buildPracticeSteps(
          event.practice?._count.practiceMembers ?? 0,
          schedule,
        );
  // 開催日の当日以降も「開催予定」のままなら、状態の更新を促す
  const isOverdue =
    event.status === "scheduled" && isOnOrAfterJstDay(new Date(), event.date);

  return (
    <>
      <PageHeader
        title={game ? (game.opponent?.name ?? "対戦相手未定") : "練習"}
        backHref="/admin/events"
      />
      <section className="flex flex-col gap-4 border-b px-4 py-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-bold">{formatJstDateTimeWithDay(event.date)}</p>
            <EventTypeTag type={event.type} gameType={game?.gameType} />
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            @{groundName ?? "未定"}
          </p>
        </div>
        {score && (
          <p className="text-3xl font-bold">
            {score}
            {game?.result && (
              <span className="ml-2 text-base">
                {gameResultLabel[game.result]}
              </span>
            )}
          </p>
        )}
        <EventStatusControl
          key={event.status}
          eventId={id}
          status={event.status}
        />
        {isOverdue && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <OverdueMark />
            開催日を過ぎています。終わったら「開催済み」にしてください。
          </p>
        )}
      </section>
      <EventSteps
        eventId={id}
        heading={game ? "試合の入力" : "練習の入力"}
        steps={steps}
        numbered
      />
      {game && (
        <EventResultSummary
          opponentName={game.opponent?.name ?? null}
          isFirstBatting={game.isFirstBatting}
          game={game}
        />
      )}
      <div className="p-4">
        <DeleteButton
          targetName={`${formatJstDateTimeWithDay(event.date)} ${event.type === "game" ? "試合" : "練習"}`}
          warning="結果・オーダー・成績などの関連データもすべて削除されます。"
          action={deleteEvent.bind(null, id)}
        />
      </div>
    </>
  );
}
