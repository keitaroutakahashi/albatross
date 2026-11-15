import {
  summarizeTeamRecord,
  type TeamRecord,
} from "@/app/_utils/stats/team-record";
import type { GameResult } from "@/generated/prisma/enums";

export type InningScore = {
  inningNumber: number;
  teamScore: number;
  opponentScore: number;
};

export type GameFlowInput = {
  /** true: 先攻（各回の表）, false: 後攻（各回の裏）, null: 未定 */
  isFirstBatting: boolean | null;
  result: GameResult | null;
  teamScore: number | null;
  opponentScore: number | null;
  innings: InningScore[];
};

/** 1 試合の展開 */
export type GameFlow = {
  /** 最初に得点したのが自チームか（無得点の試合は null） */
  scoredFirst: boolean | null;
  /** 自チームが、いずれかの攻守交代の時点でリードしていたか */
  wasLeading: boolean;
  /** 自チームが、いずれかの攻守交代の時点でリードされていたか */
  wasTrailing: boolean;
  /** いずれかの攻守交代の時点での、最大の失点差（リードされなかった試合は 0） */
  maxDeficit: number;
};

/** 「大差」とみなす失点差。この点差以上リードされた試合を、大差からの逆転の対象にする */
export const BIG_DEFICIT_RUNS = 3;

/**
 * イニングごとの得点から、試合の展開（先制・リード・ビハインド）を判定する。
 * 攻撃の順番がわからない（先攻・後攻が未定）、またはイニング得点の記録がない
 * 試合は判定できないため null を返す。
 *
 * 1 つの攻撃では片方の得点しか動かないため、攻守交代ごとの得点差を見れば、
 * 試合中に一度でもリード・ビハインドがあったかを漏れなく判定できる。
 */
export const analyzeGameFlow = ({
  isFirstBatting,
  innings,
}: Pick<GameFlowInput, "isFirstBatting" | "innings">): GameFlow | null => {
  if (isFirstBatting === null || innings.length === 0) return null;

  const sorted = [...innings].sort((a, b) => a.inningNumber - b.inningNumber);
  const halves = sorted.flatMap(({ teamScore, opponentScore }) => {
    const team = { side: "team", runs: teamScore } as const;
    const opponent = { side: "opponent", runs: opponentScore } as const;

    return isFirstBatting ? [team, opponent] : [opponent, team];
  });

  let teamRuns = 0;
  let opponentRuns = 0;
  let scoredFirst: boolean | null = null;
  let wasLeading = false;
  let wasTrailing = false;
  let maxDeficit = 0;

  for (const { side, runs } of halves) {
    if (runs > 0 && scoredFirst === null) scoredFirst = side === "team";

    if (side === "team") teamRuns += runs;
    else opponentRuns += runs;

    if (teamRuns > opponentRuns) wasLeading = true;
    if (teamRuns < opponentRuns) wasTrailing = true;
    maxDeficit = Math.max(maxDeficit, opponentRuns - teamRuns);
  }

  return { scoredFirst, wasLeading, wasTrailing, maxDeficit };
};

export type GameFlowKey =
  | "scoredFirst"
  | "concededFirst"
  | "wasLeading"
  | "wasTrailing"
  | "wasBigTrailing"
  | "oneRun";

/** 表示順。wasTrailing の勝ちが逆転勝ち、wasBigTrailing の勝ちが大差からの逆転勝ち、wasLeading の負けが逆転負け */
export const GAME_FLOW_KEYS: GameFlowKey[] = [
  "scoredFirst",
  "concededFirst",
  "wasLeading",
  "wasTrailing",
  "wasBigTrailing",
  "oneRun",
];

export type GameFlowSummary = Record<GameFlowKey, TeamRecord>;

/**
 * 試合の展開別に戦績を集計する。
 * 先制・リード・ビハインドはイニング得点から判定できた試合だけが対象。
 */
export const summarizeGameFlows = (games: GameFlowInput[]): GameFlowSummary => {
  const analyzed = games.map((game) => ({ game, flow: analyzeGameFlow(game) }));

  const pick = (
    predicate: (game: GameFlowInput, flow: GameFlow | null) => boolean,
  ) =>
    summarizeTeamRecord(
      analyzed
        .filter(({ game, flow }) => predicate(game, flow))
        .map((a) => a.game),
    );

  return {
    scoredFirst: pick((_, flow) => flow?.scoredFirst === true),
    concededFirst: pick((_, flow) => flow?.scoredFirst === false),
    wasLeading: pick((_, flow) => flow?.wasLeading === true),
    wasTrailing: pick((_, flow) => flow?.wasTrailing === true),
    wasBigTrailing: pick(
      (_, flow) => flow !== null && flow.maxDeficit >= BIG_DEFICIT_RUNS,
    ),
    oneRun: pick(
      ({ teamScore, opponentScore }) =>
        teamScore !== null &&
        opponentScore !== null &&
        Math.abs(teamScore - opponentScore) === 1,
    ),
  };
};
