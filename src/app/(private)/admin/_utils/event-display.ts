import { gameTypeLabel, weatherLabel } from "@/app/_constants/labels";
import { formatSeason } from "@/app/_utils/season";
import type { GameType, Weather } from "@/generated/prisma/enums";

type ScoreSource = {
  teamScore: number | null;
  opponentScore: number | null;
  teamForfeitedRuns: number | null;
  opponentForfeitedRuns: number | null;
};

/**
 * 献上点を含めた合計点。得点が未入力なら null。
 * 勝敗は、この合計で決まる。
 */
export const getGameTotals = (
  game: ScoreSource,
): { team: number; opponent: number } | null =>
  game.teamScore !== null && game.opponentScore !== null
    ? {
        team: game.teamScore + (game.teamForfeitedRuns ?? 0),
        opponent: game.opponentScore + (game.opponentForfeitedRuns ?? 0),
      }
    : null;

/** 試合の得点を「3-1」の形で返す。得点が未入力なら null。表示も、献上点を含めた合計にそろえる */
export const formatGameScore = (game: ScoreSource): string | null => {
  const totals = getGameTotals(game);
  return totals ? `${totals.team}-${totals.opponent}` : null;
};

/** 「いつ・どこで」の現在の値。例: 2026年度シーズン / @駒沢 A面 / 雨天中止 */
export const describeSchedule = (event: {
  season: number;
  groundName: string | null;
  groundCourt: string | null;
  note: string | null;
}): string =>
  [
    formatSeason(event.season),
    event.groundName
      ? `@${[event.groundName, event.groundCourt].filter(Boolean).join(" ")}`
      : "@グラウンド未定",
    event.note,
  ]
    .filter((part) => part)
    .join(" / ");

/** 「対戦」の現在の値。例: 世田谷ウィングス / 練習試合 / 先攻 */
export const describeMatchup = (game: {
  opponentName: string | null;
  leagueName: string | null;
  gameType: GameType;
  isFirstBatting: boolean | null;
}): string => {
  const parts = [
    game.opponentName ?? "対戦相手未定",
    game.leagueName,
    game.gameType === "undecided" ? null : gameTypeLabel[game.gameType],
    game.isFirstBatting === null ? null : game.isFirstBatting ? "先攻" : "後攻",
  ].filter((part) => part);
  // リーグ名が試合種別と同じ（「練習試合」など）ときは、重複して並べない
  return [...new Set(parts)].join(" / ");
};

/** 「試合の振り返り」の現在の値。入力が 1 つもなければ空文字。例: 晴れ 18℃ / 戦評あり */
export const describeReview = (game: {
  weather: Weather | null;
  temperature: number | null;
  summary: string | null;
  videoUrl: string | null;
  externalUrl: string | null;
  aiGoodPoints: string | null;
  aiBadPoints: string | null;
  mvpCount: number;
}): string =>
  [
    game.weather
      ? `${weatherLabel[game.weather]}${game.temperature === null ? "" : ` ${game.temperature}℃`}`
      : null,
    game.summary ? "戦評あり" : null,
    game.videoUrl ? "動画あり" : null,
    game.externalUrl ? "外部リンクあり" : null,
    game.mvpCount > 0 ? `MVP ${game.mvpCount}人` : null,
    game.aiGoodPoints || game.aiBadPoints ? "AI 講評あり" : null,
  ]
    .filter((part) => part)
    .join(" / ");
