import { toJstDateTimeLocal } from "@/app/_utils/date/date";
import type { getEvent } from "@/app/(private)/admin/_data/event";
import type { EventType } from "@/generated/prisma/enums";

/** フォームの初期値。入力欄はすべて文字列で扱う */
export type EventFormInitial = {
  type: EventType;
  date: string;
  status: string;
  seasonId: string;
  note: string;
  cancelReason: string;
  groundId: string;
  groundCourt: string;
  gameType: string;
  isFirstBatting: string;
  leagueId: string;
  opponentId: string;
  teamScore: string;
  opponentScore: string;
  teamHits: string;
  opponentHits: string;
  teamErrors: string;
  opponentErrors: string;
  teamForfeitedRuns: string;
  opponentForfeitedRuns: string;
  weather: string;
  temperature: string;
  summary: string;
  videoUrl: string;
  aiGoodPoints: string;
  aiBadPoints: string;
};

type EventDetail = NonNullable<Awaited<ReturnType<typeof getEvent>>>;

const str = (value: number | string | null | undefined): string =>
  value === null || value === undefined ? "" : String(value);

export const toEventFormInitial = (event: EventDetail): EventFormInitial => {
  const game = event.game;
  return {
    type: event.type,
    date: toJstDateTimeLocal(event.date),
    status: event.status,
    seasonId: str(event.seasonId),
    note: str(event.note),
    cancelReason: str(event.cancelReason),
    groundId: str(game?.groundId ?? event.practice?.groundId),
    groundCourt: str(game?.groundCourt ?? event.practice?.groundCourt),
    gameType: game?.gameType ?? "undecided",
    isFirstBatting:
      game?.isFirstBatting == null ? "" : String(game.isFirstBatting),
    leagueId: str(game?.leagueId),
    opponentId: str(game?.opponentId),
    teamScore: str(game?.teamScore),
    opponentScore: str(game?.opponentScore),
    teamHits: str(game?.teamHits),
    opponentHits: str(game?.opponentHits),
    teamErrors: str(game?.teamErrors),
    opponentErrors: str(game?.opponentErrors),
    teamForfeitedRuns: str(game?.teamForfeitedRuns),
    opponentForfeitedRuns: str(game?.opponentForfeitedRuns),
    weather: str(game?.gameWeather?.weather),
    temperature: str(game?.gameWeather?.temperature),
    summary: str(game?.summary),
    videoUrl: str(game?.videoUrl),
    aiGoodPoints: str(game?.aiGoodPoints),
    aiBadPoints: str(game?.aiBadPoints),
  };
};
