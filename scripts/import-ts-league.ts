/**
 * parse-ts-league.ts が作った JSON から、試合の成績を取り込む。
 * 試合日（JST）と対戦相手が一致するイベントがあれば更新し、無ければ新規作成する。
 * 取り込むのは、イベント（日時・会場・リーグ・対戦相手）・参加メンバー・オーダー・
 * イニングごとの得点・打席・投手成績・盗塁・戦評・状態（終了）。
 * シーズン・リーグ・グラウンド・メンバーはマスタに無いと止まる（対戦相手だけ自動作成する）。
 *
 *   # 内容の確認のみ（書き込まない）
 *   pnpm game:import game.json
 *   pnpm game:import:production game.json
 *   # 書き込み。整合性の警告があるときは --accept-warnings も必要
 *   pnpm game:import:production game.json --apply [--accept-warnings]
 */
import { readFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { config } from "dotenv";
import type { Member } from "@/generated/prisma/client";
import type { AtBatResult, GameType, Position } from "@/generated/prisma/enums";
import type { ParsedGame } from "./ts-league/types";
import { fetchGameWeather, parseCoordinates } from "./ts-league/weather";

// lib/prisma.ts は読み込み時に DATABASE_URL を参照するため、先に環境変数を読み込む
config({ path: ".env.local" });

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    apply: { type: "boolean", default: false },
    "accept-warnings": { type: "boolean", default: false },
  },
});
const jsonPath = positionals[0];
if (!jsonPath) {
  console.error("使い方: pnpm game:import <game.json> [--apply]");
  process.exit(1);
}
const parsed: ParsedGame = JSON.parse(readFileSync(jsonPath, "utf-8"));

const errors: string[] = [];
const warnings: string[] = [];

/** 元ページが旧字体などで表記している名前を、メンバーの登録名に寄せる */
const normalizeName = (name: string) => name.replace(/栁/g, "柳");

const POSITIONS: Record<string, Position> = {
  投: "pitcher",
  捕: "catcher",
  一: "first",
  二: "second",
  三: "third",
  遊: "shortstop",
  左: "left",
  中: "center",
  右: "right",
  DH: "dh",
};

const SUFFIX_RESULTS: Record<string, AtBatResult> = {
  ゴ: "groundOut",
  飛: "flyOut",
  安: "single",
  "2": "double",
  本: "homeRun",
  失: "error",
};

const HIT_RESULTS: readonly AtBatResult[] = [
  "single",
  "double",
  "triple",
  "homeRun",
];

/** 元ページの表記から打席結果と打球方向を求める。分からない表記は null（取り込まずに止める） */
const toResult = (
  label: string,
): { result: AtBatResult; direction: Position | null } | null => {
  // 「ニ」（カタカナ）は「二」、二塁打の「２」（全角）は半角に寄せる
  const normalized = label
    .replace("ニ", "二")
    .replace(/[０-９]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0xfee0));
  if (normalized === "三振") return { result: "strikeout", direction: null };
  if (normalized === "四球") return { result: "walk", direction: null };
  if (normalized === "死球") return { result: "hitByPitch", direction: null };
  const [fielder, suffix] = [...normalized];
  const direction = fielder ? POSITIONS[fielder] : undefined;
  const result = suffix ? SUFFIX_RESULTS[suffix] : undefined;
  if (normalized.length !== 2 || !direction || !result) return null;
  return { result, direction };
};

/** "2回0/3" → 完了イニング 2、端数なし(null)。"1回2/3" → 1 と 2 */
const toInnings = (text: string) => {
  const m = text.match(/^(\d+)回(\d)\/3$/);
  if (!m) return null;
  const outs = Number(m[2]);
  return {
    inningsPitched: Number(m[1]),
    partialOuts: outs === 0 ? null : outs,
  };
};

/** 勝敗の列がこの値の投手を責任投手にする */
const RESPONSIBLE_DECISIONS = ["勝", "負"];

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

// --- 元データの整合性（ここでの警告は、取り込む前にユーザーへ確認する） ---
const innings = parsed.innings;
const allAtBats = parsed.batting.flatMap((b) => b.atBats);
const hits = allAtBats.filter((a) => {
  const mapped = toResult(a.label);
  return mapped !== null && HIT_RESULTS.includes(mapped.result);
}).length;
const check = (what: string, actual: number, expected: number) => {
  if (actual !== expected) {
    warnings.push(`${what}: 個人の合計 ${actual} / チーム・表の値 ${expected}`);
  }
};
const teamForfeitedRuns = parsed.teamForfeitedRuns ?? 0;
// 自チームの失策は、相手の打撃成績にある「○失」の数を使う（相手の打撃成績がないページはチーム成績の値）
const teamErrors =
  parsed.teamErrorsFromOpponentBatting ?? parsed.teamTotals.errors;
check(
  "チームの得点（イニング合計と献上点）",
  sum(innings.team) + teamForfeitedRuns,
  innings.teamTotal,
);
check(
  "相手の得点（イニング合計）",
  sum(innings.opponent),
  innings.opponentTotal,
);
check(
  "個人の得点とイニング得点",
  sum(parsed.batting.map((b) => b.runsColumn)),
  innings.teamTotal,
);
check("打席数", allAtBats.length, parsed.teamTotals.plateAppearances);
check("安打数", hits, parsed.teamTotals.hits);
check(
  "打点（打席の括弧）",
  sum(allAtBats.map((a) => a.rbi)),
  parsed.teamTotals.rbi,
);
check(
  "盗塁",
  sum(parsed.batting.map((b) => b.stolenBases)),
  parsed.teamTotals.stolenBases,
);
for (const b of parsed.batting) {
  check(
    `${b.name} の打点（打席の括弧と打点の列）`,
    sum(b.atBats.map((a) => a.rbi)),
    b.rbiColumn,
  );
  for (const a of b.atBats) {
    if (a.inning > innings.team.length) {
      warnings.push(
        `${b.name}: ${a.inning}回の打席があるが、試合は ${innings.team.length} 回まで`,
      );
    }
  }
}
const pitchers = parsed.pitching.map((p) => ({
  p,
  ip: toInnings(p.inningsText),
}));
check(
  "失点（投手の合計と相手の得点）",
  sum(parsed.pitching.map((p) => p.runs)),
  sum(innings.opponent),
);
check(
  "被安打",
  sum(parsed.pitching.map((p) => p.hitsAllowed)),
  parsed.teamTotals.pitching.hitsAllowed,
);
check(
  "奪三振",
  sum(parsed.pitching.map((p) => p.strikeouts)),
  parsed.teamTotals.pitching.strikeouts,
);
check(
  "与四球",
  sum(parsed.pitching.map((p) => p.walks)),
  parsed.teamTotals.pitching.walks,
);
check(
  "与死球",
  sum(parsed.pitching.map((p) => p.hitByPitches)),
  parsed.teamTotals.pitching.hitByPitches,
);
for (const { p, ip } of pitchers) {
  if (!ip) errors.push(`${p.name}: 投球回を読めません: ${p.inningsText}`);
  if (p.earnedRuns > p.runs) warnings.push(`${p.name}: 自責点が失点より多い`);
  if (p.decision !== "" && !RESPONSIBLE_DECISIONS.includes(p.decision)) {
    warnings.push(
      `${p.name}: 勝敗の列に未対応の値 "${p.decision}" がある。責任投手の扱いを確認すること`,
    );
  }
}
const parsedAtBats = parsed.batting.flatMap((b) =>
  b.atBats.map((a) => ({ b, a, mapped: toResult(a.label) })),
);
for (const { b, a, mapped } of parsedAtBats) {
  if (!mapped)
    errors.push(`${b.name}: 未対応の打席結果 "${a.label}"（${a.inning}回）`);
}

const { default: prisma } = await import("@/lib/prisma");
const { calcGameScore } = await import("@/app/_utils/stats/game-score");
const { syncBattingTotals, syncPitchingTotals } = await import(
  "@/app/(private)/admin/_utils/game-stats"
);
const { renumberGamesOfDay } = await import(
  "@/app/(private)/admin/_utils/game-number"
);

// --- マスタの解決（無いものは、相手チーム以外は止める） ---
const year = Number(parsed.date.slice(0, 4));
const season = await prisma.season.findUnique({ where: { season: year } });
if (!season) errors.push(`${year} 年のシーズンがマスタにありません`);

const leagues = await prisma.league.findMany();
const leagueMatches = leagues.filter(
  (l) =>
    parsed.leagueText !== "" &&
    (parsed.leagueText.includes(l.name) || l.name.includes(parsed.leagueText)),
);
const league = leagueMatches.length === 1 ? leagueMatches[0] : undefined;
if (!league) {
  errors.push(
    `リーグ "${parsed.leagueText}" に対応するマスタが 1 件に決まりません（候補 ${leagueMatches.length} 件）`,
  );
}

const gameType: GameType | null = parsed.gameTypeText.includes("公式戦")
  ? "official"
  : parsed.gameTypeText.includes("練習試合")
    ? "practice"
    : null;
if (!gameType) {
  errors.push(`試合種別 "${parsed.gameTypeText}" を判定できません`);
}

// 会場の表記は「<グラウンド名><面>(<最寄り>)野球場」。面（A面・B面）を分けて、グラウンド名で探す
const venue = parsed.venueText.match(/^(.*?)([A-ZＡ-Ｚ])面/);
const groundBase = venue ? (venue[1] as string) : parsed.venueText;
const groundCourt = venue ? `${venue[2]}面` : null;
const normalizeGround = (name: string) =>
  name.replace(/\s+/g, "").replace(/(野球場|球場)$/, "");
const grounds = await prisma.ground.findMany();
const groundMatches = grounds.filter(
  (g) => normalizeGround(g.name) === normalizeGround(groundBase),
);
const ground = groundMatches.length === 1 ? groundMatches[0] : undefined;
if (!ground) {
  errors.push(
    `会場 "${parsed.venueText}" に対応するグラウンドが 1 件に決まりません（候補 ${groundMatches.length} 件）。グラウンドは自動作成しません`,
  );
}

const existingOpponent = await prisma.opponent.findUnique({
  where: { name: parsed.opponent },
});

// --- メンバーの対応づけ（無い選手は自動作成しない） ---
const allMembers = await prisma.member.findMany();
const resolvedMembers = new Map<string, Member>();
const resolveMember = (name: string, uniformNumber: string): Member | null => {
  const cached = resolvedMembers.get(name);
  if (cached) return cached;
  const byName = allMembers.filter(
    (m) => normalizeName(m.name) === normalizeName(name),
  );
  const byNumber = allMembers.filter((m) => m.uniformNumber === uniformNumber);
  const found =
    byName.length === 1
      ? byName[0]
      : byNumber.length === 1
        ? byNumber[0]
        : null;
  if (!found) {
    errors.push(
      `${name}(${uniformNumber}): メンバーのマスタに該当する選手がいません。メンバーは自動作成しません`,
    );
    return null;
  }
  if (byName.length !== 1) {
    warnings.push(
      `${name}: 名前が一致せず背番号 ${uniformNumber} で ${found.name} に対応づけた`,
    );
  }
  resolvedMembers.set(name, found);
  return found;
};

const batters = parsed.batting.flatMap((b) => {
  const member = resolveMember(b.name, b.uniformNumber);
  const position = POSITIONS[b.position];
  if (!position) {
    errors.push(`${b.name}: 未対応の守備位置 "${b.position}"`);
  }
  return member && position ? [{ b, member, position }] : [];
});
const pitcherMembers = pitchers.flatMap(({ p, ip }) => {
  const member = resolveMember(p.name, p.uniformNumber);
  return member && ip ? [{ p, ip, member }] : [];
});

// --- オーダーの検証（管理画面の parseLineup と同じ条件） ---
const lineupOrderOk = batters.every(({ b }, i) => b.order === i + 1);
if (!lineupOrderOk) errors.push("打順が 1 番から連続していません");
if (batters.length < 9)
  errors.push(`スタメンが ${batters.length} 人しかいません`);
if (batters.length > 20) errors.push("スタメンが 20 人を超えています");
const usedPositions = batters.map((x) => x.position).filter((p) => p !== "dh");
if (new Set(usedPositions).size !== usedPositions.length) {
  errors.push("DH 以外の守備位置が重複しています");
}
const missingPositions = Object.values(POSITIONS).filter(
  (p) => p !== "dh" && !usedPositions.includes(p),
);
if (missingPositions.length > 0) {
  errors.push(`守備位置が足りません: ${missingPositions.join(", ")}`);
}
if (new Set(batters.map((x) => x.member.id)).size !== batters.length) {
  errors.push("同じ選手が打順に複数回います");
}

// --- 更新先のイベント（試合日 JST と対戦相手で特定する。無ければ新規作成） ---
const dayStart = new Date(`${parsed.date}T00:00:00+09:00`);
const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
const candidates = await prisma.game.findMany({
  where: {
    event: { date: { gte: dayStart, lt: dayEnd } },
    opponent: { name: parsed.opponent },
  },
  include: {
    event: true,
    gameWeather: true,
    participants: true,
    gameMembers: {
      include: {
        member: true,
        pitchingResult: { select: { id: true } },
        _count: { select: { plateAppearances: true } },
      },
    },
    _count: { select: { innings: true } },
  },
});
if (candidates.length > 1) {
  errors.push(
    `${parsed.date} の ${parsed.opponent} 戦が複数あります: event ${candidates.map((c) => c.eventId).join(", ")}`,
  );
}
const game = candidates.length === 1 ? candidates[0] : undefined;

if (!parsed.time) {
  warnings.push("開始時刻が元ページにないため 0:00 で作成します");
}
const startsAt = new Date(`${parsed.date}T${parsed.time ?? "00:00"}:00+09:00`);

const gameMemberOf = (memberId: number) =>
  game?.gameMembers.find((gm) => gm.memberId === memberId);

if (game) {
  // 既存のイベントは、空の項目だけ埋める。違いは警告にとどめ、上書きしない
  if (game._count.innings > 0) errors.push("イニング得点が入力済みです");
  if (game.gameMembers.some((gm) => gm._count.plateAppearances > 0)) {
    errors.push("打席が入力済みです");
  }
  if (game.gameMembers.some((gm) => gm.pitchingResult !== null)) {
    errors.push("投手成績が入力済みです");
  }
  if (parsed.summary && game.summary) {
    errors.push("戦評が入力済みです（上書きしません）");
  }
  if (game.event.date.getTime() !== startsAt.getTime()) {
    warnings.push(
      `開始日時が違う（DB ${game.event.date.toISOString()} / 元ページ ${startsAt.toISOString()}）。上書きしません`,
    );
  }
  if (game.groundId && ground && game.groundId !== ground.id) {
    warnings.push("グラウンドが違います。上書きしません");
  }
  if (game.leagueId && league && game.leagueId !== league.id) {
    warnings.push("リーグが違います。上書きしません");
  }
  if (game.gameType !== "undecided" && gameType && game.gameType !== gameType) {
    warnings.push(
      `試合種別が違う（DB ${game.gameType} / 元ページ ${gameType}）。上書きしません`,
    );
  }

  // 登録済みのオーダーは、元ページと一致していなければ止める（人が入力したものを書き換えない）
  if (game.gameMembers.length > 0) {
    const starters = game.gameMembers.filter((gm) => gm.battingOrder !== null);
    for (const { b, member, position } of batters) {
      const gm = gameMemberOf(member.id);
      if (!gm || gm.battingOrder !== b.order || gm.position !== position) {
        errors.push(
          `${b.name}: 登録済みのオーダーが元ページと違います（DB ${gm?.battingOrder ?? "なし"}番 ${gm?.position ?? "-"} / 元ページ ${b.order}番 ${position}）。管理画面で直してください`,
        );
      }
    }
    if (starters.length !== batters.length) {
      errors.push(
        `登録済みのスタメンが ${starters.length} 人で、元ページの ${batters.length} 人と違います`,
      );
    }
  }
}

// 打順に入っていない投手は、ベンチとして追加する（投手成績はオーダーの選手にしか付けられない）
const lineupMemberIds = new Set([
  ...batters.map((x) => x.member.id),
  ...(game?.gameMembers.map((gm) => gm.memberId) ?? []),
]);
const benchPitchers = pitcherMembers.filter(
  ({ member }) => !lineupMemberIds.has(member.id),
);
for (const { member } of benchPitchers) {
  warnings.push(
    `${member.name}: 打順に入っていないため、ベンチとして追加して投手成績を付ける`,
  );
}

// --- 天気と気温（グラウンドの位置と試合の日時から求める。既にあれば触らない） ---
let weatherPlan: Awaited<ReturnType<typeof fetchGameWeather>> | null = null;
if (!game?.gameWeather) {
  const coordinates = ground ? parseCoordinates(ground.mapEmbedUrl) : null;
  if (!ground) {
    // グラウンドが決まらないときは、すでにエラーにしている
  } else if (!coordinates) {
    warnings.push(
      `${ground.name}: 地図の URL から位置を読めないため、天気を設定しない`,
    );
  } else if (!parsed.time) {
    warnings.push("開始時刻が元ページにないため、天気を設定しない");
  } else {
    try {
      weatherPlan = await fetchGameWeather({
        ...coordinates,
        date: parsed.date,
        time: parsed.time,
      });
    } catch (e) {
      warnings.push(
        `天気を取得できなかったため、設定しない（${e instanceof Error ? e.message : e}）`,
      );
    }
  }
}

// --- 書き込む内容 ---
const score = calcGameScore({
  teamInnings: innings.team,
  opponentInnings: innings.opponent,
  teamForfeitedRuns,
  opponentForfeitedRuns: 0,
});

type PlateAppearancePlan = {
  memberId: number;
  name: string;
  inningNumber: number;
  rbi: number;
  result: AtBatResult;
  direction: Position | null;
};
const plateAppearances: PlateAppearancePlan[] = parsedAtBats.flatMap(
  ({ b, a, mapped }) => {
    const member = resolvedMembers.get(b.name);
    return mapped && member
      ? [
          {
            memberId: member.id,
            name: b.name,
            inningNumber: a.inning,
            rbi: a.rbi,
            ...mapped,
          },
        ]
      : [];
  },
);
// 打席番号は、選手ごとにイニング順で振る
const atBatNumbers = new Map<number, number>();
const plateAppearancePlans = [...plateAppearances]
  .sort((x, y) => x.inningNumber - y.inningNumber)
  .map((pa) => {
    const next = (atBatNumbers.get(pa.memberId) ?? 0) + 1;
    atBatNumbers.set(pa.memberId, next);
    return { ...pa, atBatInGame: next };
  });

const stolenBasePlans = batters.flatMap(({ b, member }) =>
  b.stolenBases > 0
    ? [{ memberId: member.id, stolenBases: b.stolenBases }]
    : [],
);

const participantIds = [
  ...new Set([
    ...batters.map((x) => x.member.id),
    ...pitcherMembers.map((x) => x.member.id),
  ]),
];
const existingParticipantIds = new Set(
  game?.participants.map((p) => p.memberId) ?? [],
);

console.log(
  "== 更新先 ==",
  game
    ? {
        mode: "既存のイベントを更新",
        eventId: game.eventId,
        gameId: game.id,
        date: game.event.date.toISOString(),
        status: `${game.event.status} -> completed`,
        isFirstBatting: `${game.isFirstBatting} -> ${parsed.isFirstBatting}`,
      }
    : {
        mode: "イベントを新規作成",
        date: startsAt.toISOString(),
        status: "completed",
        isFirstBatting: parsed.isFirstBatting,
      },
);
console.log("== マスタ ==", {
  season: season?.season,
  league: league?.name,
  gameType,
  ground: ground?.name,
  groundCourt,
  opponent: existingOpponent
    ? existingOpponent.name
    : `${parsed.opponent}（新規作成）`,
});
console.log("== 参加メンバー ==");
console.log(
  participantIds
    .map((id) => allMembers.find((m) => m.id === id)?.name)
    .join("、"),
  existingParticipantIds.size > 0
    ? `（登録済み ${existingParticipantIds.size} 人。足りない人を追加）`
    : "",
);
console.log(
  `== オーダー ${game && game.gameMembers.length > 0 ? "(登録済み。変更なし)" : "(新規登録)"} ==`,
);
console.table(
  batters.map(({ b, member, position }) => ({
    order: b.order,
    name: member.name,
    position,
  })),
);
if (benchPitchers.length > 0) {
  console.log(
    `ベンチに追加: ${benchPitchers.map((x) => x.member.name).join("、")}`,
  );
}
console.log(
  "== 試合 ==",
  score,
  `teamErrors: ${teamErrors}`,
  parsed.teamErrorsFromOpponentBatting === null
    ? "（相手の打撃成績なし。チーム成績の値）"
    : `（相手の打撃成績の「失」。チーム成績の値は ${parsed.teamTotals.errors}）`,
);
// 管理画面の試合の振り返り（eventReviewSchema）と同じ上限
if (parsed.summary && parsed.summary.length > 2000) {
  errors.push(`戦評が 2000 字を超えています（${parsed.summary.length} 字）`);
}
console.log(
  "== 天気 ==",
  game?.gameWeather
    ? `登録済み（${game.gameWeather.weather} ${game.gameWeather.temperature ?? "-"}℃）。変更しない`
    : (weatherPlan ?? "（設定しない）"),
);
console.log("== 戦評 ==", parsed.summary ?? "（なし。書き込まない）");
console.table(
  innings.team.map((t, i) => ({
    inning: i + 1,
    team: t,
    opponent: innings.opponent[i],
  })),
);
console.log(`== 打席 (${plateAppearancePlans.length}) ==`);
console.table(plateAppearancePlans.map(({ memberId: _id, ...rest }) => rest));
console.log("== 投手 ==");
console.table(parsed.pitching);
console.log(
  "== 盗塁 ==",
  parsed.batting
    .filter((b) => b.stolenBases > 0)
    .map((b) => `${b.name}: ${b.stolenBases}`),
);
console.log(`\n== 警告 (${warnings.length}) ==`);
for (const w of warnings) console.log(`- ${w}`);
console.log(`\n== エラー (${errors.length}) ==`);
for (const e of errors) console.log(`- ${e}`);

const finish = async (code: number): Promise<never> => {
  await prisma.$disconnect();
  process.exit(code);
};

if (errors.length > 0) await finish(1);
if (!values.apply) {
  console.log("\n--apply を付けていないため、書き込みは行っていません");
  await finish(0);
}
if (warnings.length > 0 && !values["accept-warnings"]) {
  console.log(
    "\n警告があるため書き込みません。内容を確認のうえ --accept-warnings を付けてください",
  );
  await finish(1);
}
// ここまで来ていれば、検証済みでマスタも揃っている（型を絞るための確認）
if (!season || !league || !ground || !gameType) {
  await finish(1);
  throw new Error("unreachable");
}

const gameId = await prisma.$transaction(async (tx) => {
  const opponent =
    existingOpponent ??
    (await tx.opponent.create({ data: { name: parsed.opponent } }));

  let id: number;
  if (game) {
    id = game.id;
    await tx.game.update({
      where: { id },
      data: {
        // 既存のイベントは、空の項目だけ埋める
        gameType: game.gameType === "undecided" ? gameType : undefined,
        leagueId: game.leagueId ?? league?.id,
        groundId: game.groundId ?? ground?.id,
        groundCourt: game.groundCourt ?? groundCourt,
        ...score,
        teamForfeitedRuns,
        opponentForfeitedRuns: 0,
        teamErrors,
        isFirstBatting: parsed.isFirstBatting,
        ...(parsed.summary ? { summary: parsed.summary } : {}),
      },
    });
    await tx.event.update({
      where: { id: game.eventId },
      data: { status: "completed" },
    });
  } else {
    const created = await tx.event.create({
      data: {
        type: "game",
        date: startsAt,
        seasonId: season?.id as number,
        status: "completed",
        game: {
          create: {
            gameType,
            leagueId: league?.id,
            groundId: ground?.id,
            groundCourt,
            opponentId: opponent.id,
            ...score,
            teamForfeitedRuns,
            opponentForfeitedRuns: 0,
            teamErrors,
            isFirstBatting: parsed.isFirstBatting,
            ...(parsed.summary ? { summary: parsed.summary } : {}),
          },
        },
      },
      select: { game: { select: { id: true } } },
    });
    id = (created.game as { id: number }).id;
    // 試合番号は、管理画面の登録と同じく同日の試合を日時順に振り直す
    await renumberGamesOfDay(tx, startsAt);
  }

  if (weatherPlan) {
    await tx.gameWeather.create({ data: { gameId: id, ...weatherPlan } });
  }

  await tx.gameParticipant.createMany({
    data: participantIds.map((memberId) => ({ gameId: id, memberId })),
    skipDuplicates: true,
  });

  // オーダー。登録済みなら触らず、無ければ元ページの打順どおりに作る。投手のベンチ追加は常に行う
  const gameMemberIds = new Map(
    (game?.gameMembers ?? []).map((gm) => [gm.memberId, gm.id]),
  );
  if (!game || game.gameMembers.length === 0) {
    for (const { b, member, position } of batters) {
      const created = await tx.gameMember.create({
        data: {
          gameId: id,
          memberId: member.id,
          memberType: "starting",
          battingOrder: b.order,
          position,
        },
      });
      gameMemberIds.set(member.id, created.id);
    }
  }
  for (const { member } of benchPitchers) {
    const created = await tx.gameMember.create({
      data: { gameId: id, memberId: member.id, memberType: "bench" },
    });
    gameMemberIds.set(member.id, created.id);
  }
  const gameMemberIdOf = (memberId: number) => {
    const found = gameMemberIds.get(memberId);
    if (found === undefined) throw new Error(`オーダーに居ません: ${memberId}`);
    return found;
  };

  await tx.inning.createMany({
    data: innings.team.map((teamScore, i) => ({
      gameId: id,
      inningNumber: i + 1,
      teamScore,
      opponentScore: innings.opponent[i] as number,
    })),
  });
  await tx.plateAppearance.createMany({
    data: plateAppearancePlans.map(({ memberId, name: _name, ...rest }) => ({
      ...rest,
      gameMemberId: gameMemberIdOf(memberId),
      isScoringPosition: false,
    })),
  });
  for (const s of stolenBasePlans) {
    await tx.gameMember.update({
      where: { id: gameMemberIdOf(s.memberId) },
      data: { stolenBases: s.stolenBases },
    });
  }
  await syncBattingTotals(tx, id);
  await tx.pitchingResult.createMany({
    data: pitcherMembers.map(({ p, ip, member }) => ({
      gameMemberId: gameMemberIdOf(member.id),
      pitchingOrder: p.order,
      ...ip,
      earnedRuns: p.earnedRuns,
      runs: p.runs,
      strikeouts: p.strikeouts,
      walks: p.walks,
      hitByPitches: p.hitByPitches,
      hitsAllowed: p.hitsAllowed,
      homeRunsAllowed: p.homeRunsAllowed,
      pitchCount: null,
      isResponsible: RESPONSIBLE_DECISIONS.includes(p.decision),
    })),
  });
  await syncPitchingTotals(tx, id);
  return id;
});

const after = await prisma.game.findUniqueOrThrow({
  where: { id: gameId },
  select: {
    eventId: true,
    teamScore: true,
    opponentScore: true,
    teamHits: true,
    opponentHits: true,
    opponentErrors: true,
    result: true,
  },
});
console.log("== 書き込み後 ==", after);
console.log(`管理画面: /admin/events/${after.eventId}`);
await finish(0);
