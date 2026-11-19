import { weatherLabel } from "@/app/_constants/labels";
import { ALL_SEASONS } from "@/app/_constants/stats";
import {
  type AtBatNumberBattingRow,
  type BatHandBattingRow,
  type BatHandGameMember,
  buildAtBatNumberBatting,
  buildBatHandBatting,
  buildGroundBatting,
  buildGroundPitching,
  buildMonthlyBatting,
  buildMonthlyPitching,
  buildOrderBatting,
  buildRolePitching,
  type GroundBattingRow,
  type GroundPitchingRow,
  type MonthlyBattingRow,
  type MonthlyPitchingRow,
  type OrderBattingRow,
  type RolePitchingRow,
  toPitchingGameResult,
} from "@/app/_features/stats/utils/stats-splits";
import { getMonthInJst } from "@/app/_utils/date/date";
import {
  type AtBatResultCount,
  summarizeAtBatResults,
  summarizeOutResults,
} from "@/app/_utils/stats/at-bat-breakdown";
import {
  type BattedBallBatter,
  type BattedBallByBatter,
  type BattedBallTypeSummary,
  summarizeBattedBallsByBatter,
  summarizeBattedBallTypes,
} from "@/app/_utils/stats/batted-ball";
import {
  calculatePerGame,
  calculateScoringRate,
} from "@/app/_utils/stats/batting";
import {
  type BattingSummary,
  summarizeBatting,
} from "@/app/_utils/stats/batting-summary";
import {
  type GameFlowSummary,
  summarizeGameFlows,
} from "@/app/_utils/stats/game-flow";
import {
  type InningScoringRow,
  summarizeInningScoring,
} from "@/app/_utils/stats/inning-scoring";
import {
  type PitchingSummary,
  summarizePitching,
} from "@/app/_utils/stats/pitching-summary";
import {
  type PitchingUsage,
  summarizePitchingUsage,
} from "@/app/_utils/stats/pitching-usage";
import {
  summarizeTeamRecord,
  type TeamRecord,
} from "@/app/_utils/stats/team-record";
import type { Prisma } from "@/generated/prisma/client";
import { Weather } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";

/** 対戦相手・先攻後攻・天候など、切り口ごとの戦績と主な成績 */
export type TeamSplitRow = TeamRecord & {
  key: string;
  label: string;
  /** チームの打率（打数 0 のときは null） */
  battingAverage: number | null;
  /** チームの OPS */
  ops: number | null;
  /** チームの防御率（投球回 0 のときは null） */
  era: number | null;
};

export type TeamStatsResult = {
  /** 対象の年度（全年度のときは ALL_SEASONS） */
  season: string;
  record: TeamRecord;
  /** 試合の展開別の戦績 */
  gameFlow: GameFlowSummary;
  /** 月別。全年度のときは年をまたいで同じ月を合算する */
  monthSplits: TeamSplitRow[];
  opponentSplits: TeamSplitRow[];
  /** 先攻・後攻別 */
  battingSideSplits: TeamSplitRow[];
  weatherSplits: TeamSplitRow[];

  /** 盗塁 */
  stolenBases: number;
  /** 1 試合あたりの盗塁 */
  stolenBasesPerGame: number | null;
  /** 1 試合あたりの犠打 */
  sacrificeHitsPerGame: number | null;
  /** 生還率（試合結果の得点 ÷ (安打 + 四死球)） */
  scoringRate: number | null;
  batting: BattingSummary;
  atBatResults: AtBatResultCount[];
  /** アウトになった打席の内訳 */
  outResults: AtBatResultCount[];
  /** 得点圏の打席の結果の内訳 */
  scoringPositionResults: AtBatResultCount[];
  batHandBatting: BatHandBattingRow[];
  inningScoring: InningScoringRow[];
  /** 全打者・右打者・左打者ごとの、打球方向別の打球数・安打・アウトと打球の向き */
  battedBallsByBatter: Record<BattedBallBatter, BattedBallByBatter>;
  /** アウトになった打球の種別 */
  battedBallTypes: BattedBallTypeSummary;
  groundBatting: GroundBattingRow[];
  monthlyBatting: MonthlyBattingRow[];
  orderBatting: OrderBattingRow[];
  atBatNumberBatting: AtBatNumberBattingRow[];

  /** 登板記録がないときは null */
  pitching: PitchingSummary | null;
  pitchingUsage: PitchingUsage;
  rolePitching: RolePitchingRow[];
  groundPitching: GroundPitchingRow[];
  monthlyPitching: MonthlyPitchingRow[];
};

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

const UNKNOWN_OPPONENT_NAME = "対戦相手未定";

const fetchGames = (season: string) => {
  const where: Prisma.GameWhereInput = {
    gameType: "official",
    event: {
      status: "completed",
      ...(season !== ALL_SEASONS && { season: { season: Number(season) } }),
    },
  };

  return prisma.game.findMany({
    where,
    select: {
      id: true,
      eventId: true,
      isFirstBatting: true,
      result: true,
      teamScore: true,
      opponentScore: true,
      opponent: { select: { id: true, name: true } },
      ground: { select: { id: true, name: true } },
      gameWeather: { select: { weather: true } },
      innings: {
        select: { inningNumber: true, teamScore: true, opponentScore: true },
      },
      event: { select: { date: true } },
      gameMembers: {
        select: {
          gameId: true,
          battingOrder: true,
          stolenBases: true,
          plateAppearances: {
            select: {
              result: true,
              rbi: true,
              isScoringPosition: true,
              direction: true,
              atBatInGame: true,
            },
          },
          pitchingResult: true,
          member: { select: { batHand: true } },
        },
      },
    },
    orderBy: [{ event: { date: "asc" } }, { gameNumber: "asc" }],
  });
};

type TeamGame = Awaited<ReturnType<typeof fetchGames>>[number];

/** 切り口の集計用に、選手ごとのデータへ試合の情報を持たせる */
const toSplitGameMembers = (games: TeamGame[]): BatHandGameMember[] =>
  games.flatMap((game) =>
    game.gameMembers.map((gm) => ({
      ...gm,
      batHand: gm.member.batHand,
      game: { result: game.result, ground: game.ground, event: game.event },
    })),
  );

const toSplitRow = (
  key: string,
  label: string,
  games: TeamGame[],
): TeamSplitRow => {
  const gameMembers = toSplitGameMembers(games);
  const batting = summarizeBatting(
    gameMembers.flatMap((gm) => gm.plateAppearances),
  );
  const pitching = summarizePitching(
    gameMembers.flatMap((gm) => {
      const result = toPitchingGameResult(gm);
      return result ? [result] : [];
    }),
  );

  return {
    key,
    label,
    ...summarizeTeamRecord(games),
    battingAverage: batting.average,
    ops: batting.ops,
    era: pitching.era,
  };
};

/** 試合のない月は含めない */
const buildMonthSplits = (games: TeamGame[]): TeamSplitRow[] => {
  const gamesByMonth = Map.groupBy(games, (game) =>
    getMonthInJst(game.event.date),
  );

  return MONTHS.flatMap((month) => {
    const items = gamesByMonth.get(month);

    return items ? [toSplitRow(String(month), `${month}月`, items)] : [];
  });
};

const buildOpponentSplits = (games: TeamGame[]): TeamSplitRow[] =>
  [...Map.groupBy(games, (game) => game.opponent?.id ?? null).values()]
    .map((items) =>
      toSplitRow(
        String(items[0].opponent?.id ?? "unknown"),
        items[0].opponent?.name ?? UNKNOWN_OPPONENT_NAME,
        items,
      ),
    )
    .sort((a, b) => b.games - a.games);

/** 先攻・後攻が未定の試合は含めない */
const buildBattingSideSplits = (games: TeamGame[]): TeamSplitRow[] =>
  (
    [
      { key: "first", label: "先攻", isFirstBatting: true },
      { key: "second", label: "後攻", isFirstBatting: false },
    ] as const
  ).flatMap(({ key, label, isFirstBatting }) => {
    const items = games.filter((g) => g.isFirstBatting === isFirstBatting);

    return items.length > 0 ? [toSplitRow(key, label, items)] : [];
  });

/** 天候の記録がない試合は含めない */
const buildWeatherSplits = (games: TeamGame[]): TeamSplitRow[] =>
  Object.values(Weather).flatMap((weather) => {
    const items = games.filter((g) => g.gameWeather?.weather === weather);

    return items.length > 0
      ? [toSplitRow(weather, weatherLabel[weather], items)]
      : [];
  });

/**
 * チームの成績を取得する。
 * 集計対象は「終了した公式戦」（個人成績・ランキングと同一条件）。
 * `season` に ALL_SEASONS を指定すると全年度を通算する。
 *
 * 得点・失点・勝敗は試合結果の記録、打撃・投球の各成績は個人成績の合算。
 */
export const getTeamStats = async (
  season: string,
): Promise<TeamStatsResult> => {
  const games = await fetchGames(season);
  const gameMembers = toSplitGameMembers(games);

  const plateAppearances = gameMembers.flatMap((gm) => gm.plateAppearances);
  const pitchingResults = gameMembers.flatMap((gm) => {
    const result = toPitchingGameResult(gm);
    return result ? [result] : [];
  });

  const record = summarizeTeamRecord(games);
  const batting = summarizeBatting(plateAppearances);
  const stolenBases = games
    .flatMap((game) => game.gameMembers)
    .reduce((sum, gm) => sum + gm.stolenBases, 0);
  const battedBalls = gameMembers.flatMap((gm) =>
    gm.plateAppearances.map((pa) => ({
      result: pa.result,
      direction: pa.direction,
      batHand: gm.batHand,
    })),
  );

  return {
    season,
    record,
    gameFlow: summarizeGameFlows(games),
    opponentSplits: buildOpponentSplits(games),
    battingSideSplits: buildBattingSideSplits(games),
    weatherSplits: buildWeatherSplits(games),
    monthSplits: buildMonthSplits(games),

    stolenBases,
    stolenBasesPerGame: calculatePerGame({
      count: stolenBases,
      games: record.games,
    }),
    sacrificeHitsPerGame: calculatePerGame({
      count: batting.sacrificeHits,
      games: record.games,
    }),
    scoringRate: calculateScoringRate({
      runs: record.runsScored,
      hits: batting.hits,
      walks: batting.walks,
    }),
    batting,
    atBatResults: summarizeAtBatResults(
      plateAppearances.map((pa) => pa.result),
    ),
    outResults: summarizeOutResults(plateAppearances.map((pa) => pa.result)),
    scoringPositionResults: summarizeAtBatResults(
      plateAppearances
        .filter((pa) => pa.isScoringPosition)
        .map((pa) => pa.result),
    ),
    batHandBatting: buildBatHandBatting(gameMembers),
    inningScoring: summarizeInningScoring(games.map((g) => g.innings)),
    battedBallsByBatter: summarizeBattedBallsByBatter(battedBalls),
    battedBallTypes: summarizeBattedBallTypes(
      plateAppearances.map((pa) => pa.result),
    ),
    groundBatting: buildGroundBatting(gameMembers),
    monthlyBatting: buildMonthlyBatting(gameMembers),
    orderBatting: buildOrderBatting(gameMembers),
    atBatNumberBatting: buildAtBatNumberBatting(plateAppearances),

    pitching:
      pitchingResults.length > 0 ? summarizePitching(pitchingResults) : null,
    pitchingUsage: summarizePitchingUsage(
      games.map((game) =>
        game.gameMembers.flatMap((gm) => {
          const result = toPitchingGameResult({ ...gm, game });
          return result ? [result] : [];
        }),
      ),
    ),
    rolePitching: buildRolePitching(gameMembers),
    groundPitching: buildGroundPitching(gameMembers),
    monthlyPitching: buildMonthlyPitching(gameMembers),
  };
};
