/**
 * AI 講評の材料として、試合の成績・選手の試合前の成績・チームの流れ・同じ相手との過去の対戦を
 * DB から集めて JSON に書き出す（書き込みはしない）。
 * 成績の計算は src/app/_utils/stats/ の関数を使い、ここでは式を持たない。
 *
 *   pnpm review:data <eventId> <out.json>
 *   pnpm review:data:production <eventId> <out.json>
 */
import { writeFileSync } from "node:fs";
import { config } from "dotenv";
import { formatAtBatResult } from "@/app/_features/games/utils/at-bat-result";
import { summarizeBatting } from "@/app/_utils/stats/batting-summary";
import { formatInnings, OUTS_PER_INNING } from "@/app/_utils/stats/innings";
import { resolvePitchingDecision } from "@/app/_utils/stats/pitching-decision";
import { summarizePitching } from "@/app/_utils/stats/pitching-summary";
import type { Prisma } from "@/generated/prisma/client";

// lib/prisma.ts は読み込み時に DATABASE_URL を参照するため、先に環境変数を読み込む
config({ path: ".env.local" });

const [eventIdArg, outPath] = process.argv.slice(2);
const eventId = Number(eventIdArg);
if (!Number.isInteger(eventId) || !outPath) {
  console.error("使い方: pnpm review:data <eventId> <out.json>");
  process.exit(1);
}

const { default: prisma } = await import("@/lib/prisma");

/** 直近のチームの流れとして見る試合数 */
const RECENT_TEAM_GAMES = 5;
/** 選手の直近の調子として見る試合数 */
const RECENT_PLAYER_GAMES = 3;

const gameInclude = {
  event: true,
  opponent: true,
  ground: true,
  league: true,
  gameWeather: true,
  innings: { orderBy: { inningNumber: "asc" } },
  gameMembers: {
    include: {
      member: true,
      plateAppearances: { orderBy: { atBatInGame: "asc" } },
      pitchingResult: true,
    },
  },
} satisfies Prisma.GameInclude;
type GameRow = Prisma.GameGetPayload<{ include: typeof gameInclude }>;

const dateOf = (g: { event: { date: Date } }) =>
  new Date(g.event.date.getTime() + 9 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

const pitchingOuts = (p: {
  inningsPitched: number;
  partialOuts: number | null;
}) => p.inningsPitched * OUTS_PER_INNING + (p.partialOuts ?? 0);

/** 試合の成績。打席ごとの内訳（atBats）は講評する試合だけに付ける */
const digest = (g: GameRow, withAtBats: boolean) => {
  const battingRows = g.gameMembers
    .filter((gm) => gm.battingOrder !== null)
    .sort((a, b) => (a.battingOrder ?? 0) - (b.battingOrder ?? 0));
  const pitchingRows = g.gameMembers
    .filter((gm) => gm.pitchingResult !== null)
    .sort(
      (a, b) =>
        (a.pitchingResult?.pitchingOrder ?? 0) -
        (b.pitchingResult?.pitchingOrder ?? 0),
    );
  return {
    eventId: g.eventId,
    date: dateOf(g),
    opponent: g.opponent?.name ?? null,
    gameType: g.gameType,
    isFirstBatting: g.isFirstBatting,
    result: g.result,
    // 得点は献上点を含まない（勝敗は献上点を含めて判定している）
    teamScore: g.teamScore,
    opponentScore: g.opponentScore,
    teamForfeitedRuns: g.teamForfeitedRuns ?? 0,
    opponentForfeitedRuns: g.opponentForfeitedRuns ?? 0,
    innings: g.innings.map((i) => ({
      inning: i.inningNumber,
      team: i.teamScore,
      opponent: i.opponentScore,
    })),
    teamHits: g.teamHits,
    opponentHits: g.opponentHits,
    teamErrors: g.teamErrors,
    opponentErrors: g.opponentErrors,
    // 入力されていない項目。講評では、入っていないデータには触れない
    dataAvailable: {
      innings: g.innings.length > 0,
      plateAppearances: g.gameMembers.some(
        (gm) => gm.plateAppearances.length > 0,
      ),
      pitching: pitchingRows.length > 0,
    },
    batters: battingRows.map((gm) => {
      const s = summarizeBatting(gm.plateAppearances);
      return {
        name: gm.member.name,
        order: gm.battingOrder,
        position: gm.position,
        plateAppearances: s.plateAppearances,
        atBats: s.atBats,
        hits: s.hits,
        doubles: s.doubles,
        triples: s.triples,
        homeRuns: s.homeRuns,
        rbi: s.rbi,
        walks: s.walks,
        strikeouts: s.strikeouts,
        stolenBases: gm.stolenBases,
        ...(withAtBats
          ? {
              results: gm.plateAppearances.map((pa) => ({
                inning: pa.inningNumber,
                result: formatAtBatResult(pa.result, pa.direction),
                rbi: pa.rbi,
                scoringPosition: pa.isScoringPosition,
              })),
            }
          : {}),
      };
    }),
    pitchers: pitchingRows.map((gm) => {
      const p = gm.pitchingResult;
      if (!p) throw new Error("unreachable");
      return {
        name: gm.member.name,
        order: p.pitchingOrder,
        innings: formatInnings(pitchingOuts(p)),
        runs: p.runs,
        earnedRuns: p.earnedRuns,
        strikeouts: p.strikeouts,
        walks: p.walks,
        hitByPitches: p.hitByPitches,
        hitsAllowed: p.hitsAllowed,
        homeRunsAllowed: p.homeRunsAllowed,
        decision: resolvePitchingDecision(p.isResponsible, g.result),
      };
    }),
  };
};

const game = await prisma.game.findUnique({
  where: { eventId },
  include: gameInclude,
});
if (!game) {
  console.error(
    `イベント ${eventId} の試合が見つかりません（試合以外のイベントかもしれません）`,
  );
  await prisma.$disconnect();
  process.exit(1);
}

const seasonId = game.event.seasonId;
const before = { status: "completed" as const, date: { lt: game.event.date } };

// --- チームの流れ（この試合より前の、同じシーズンの終了した試合） ---
const pastSeasonGames = await prisma.game.findMany({
  where: { event: { ...before, seasonId } },
  include: { event: true, opponent: true },
  orderBy: { event: { date: "desc" } },
});
const record = { win: 0, lose: 0, draw: 0 };
for (const g of pastSeasonGames) if (g.result) record[g.result] += 1;

// --- 同じ相手との過去の対戦（シーズンをまたぐ。全試合） ---
const headToHeadGames = game.opponentId
  ? await prisma.game.findMany({
      where: { opponentId: game.opponentId, event: before },
      include: gameInclude,
      orderBy: { event: { date: "desc" } },
    })
  : [];

// --- 試合に出た選手の、この試合より前の今シーズンの成績 ---
const memberIds = [...new Set(game.gameMembers.map((gm) => gm.memberId))];
const priorMembers = await prisma.gameMember.findMany({
  where: {
    memberId: { in: memberIds },
    game: { event: { ...before, seasonId } },
  },
  include: {
    plateAppearances: true,
    pitchingResult: true,
    game: {
      select: {
        eventId: true,
        result: true,
        event: { select: { date: true } },
      },
    },
  },
});
const players = memberIds.map((memberId) => {
  const rows = priorMembers
    .filter((r) => r.memberId === memberId)
    .sort((a, b) => b.game.event.date.getTime() - a.game.event.date.getTime());
  const batting = rows.filter((r) => r.plateAppearances.length > 0);
  const pitching = rows.flatMap((r) =>
    r.pitchingResult
      ? [
          {
            ...r.pitchingResult,
            decision: resolvePitchingDecision(
              r.pitchingResult.isResponsible,
              r.game.result,
            ),
          },
        ]
      : [],
  );
  const bat = summarizeBatting(batting.flatMap((r) => r.plateAppearances));
  const recent = summarizeBatting(
    batting.slice(0, RECENT_PLAYER_GAMES).flatMap((r) => r.plateAppearances),
  );
  const pit = summarizePitching(pitching);
  const name =
    game.gameMembers.find((gm) => gm.memberId === memberId)?.member.name ?? "";
  return {
    name,
    // この試合より前の今シーズンの成績。試合数が少ないうちは、率より本数・回数で見る
    batting:
      bat.plateAppearances === 0
        ? null
        : {
            games: batting.length,
            plateAppearances: bat.plateAppearances,
            atBats: bat.atBats,
            hits: bat.hits,
            homeRuns: bat.homeRuns,
            rbi: bat.rbi,
            walks: bat.walks,
            strikeouts: bat.strikeouts,
            average: bat.average,
            onBasePercentage: bat.onBasePercentage,
            ops: bat.ops,
            scoringPositionAtBats: bat.scoringPositionAtBats,
            scoringPositionHits: bat.scoringPositionHits,
            recentGames: Math.min(batting.length, RECENT_PLAYER_GAMES),
            recentAtBats: recent.atBats,
            recentHits: recent.hits,
          },
    pitching:
      pit.games === 0
        ? null
        : {
            games: pit.games,
            starts: pit.starts,
            innings: formatInnings(pit.outs),
            wins: pit.wins,
            losses: pit.losses,
            strikeouts: pit.strikeouts,
            walks: pit.walks,
            hitByPitches: pit.hitByPitches,
            earnedRuns: pit.earnedRuns,
            era: pit.era,
            whip: pit.whip,
          },
  };
});

const current = digest(game, true);
const output = {
  review: {
    // 既に講評が入っているときは、skill 側で止める
    existing: {
      goodPoints: game.aiGoodPoints,
      badPoints: game.aiBadPoints,
    },
  },
  game: {
    ...current,
    league: game.league?.name ?? null,
    ground: game.ground?.name ?? null,
    weather: game.gameWeather
      ? {
          weather: game.gameWeather.weather,
          temperature: game.gameWeather.temperature,
        }
      : null,
    status: game.event.status,
    // 人が書いた戦評（試合の振り返り）。材料にするが、数字は成績を正とする
    summary: game.summary,
  },
  teamBeforeGame: {
    record,
    recentGames: pastSeasonGames.slice(0, RECENT_TEAM_GAMES).map((g) => ({
      date: dateOf(g),
      opponent: g.opponent?.name ?? null,
      teamScore: g.teamScore,
      opponentScore: g.opponentScore,
      result: g.result,
    })),
  },
  players,
  headToHead: {
    opponent: game.opponent?.name ?? null,
    games: headToHeadGames.map((g) => digest(g, false)),
  },
};

writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(
  `イベント ${eventId}（${current.date} vs ${current.opponent ?? "-"}）: 選手 ${players.length} 人 / 同じ相手との過去の試合 ${headToHeadGames.length} 件 -> ${outPath}`,
);
if (game.aiGoodPoints?.trim() || game.aiBadPoints?.trim()) {
  console.log("注意: すでに AI 講評が入力されています（上書きしません）");
}
if (game.event.status !== "completed") {
  console.log(`注意: 試合の状態が「${game.event.status}」で、終了していません`);
}
await prisma.$disconnect();
