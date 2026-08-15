import type { PitchingStatRow } from "@/app/_features/members/api/get-pitching-stats";

export type PitchingStatsCategory = {
  key: keyof PitchingStatRow;
  label: string;
  /** 並び順（防御率・WHIP のみ昇順＝値が小さいほど上位） */
  order: "asc" | "desc";
  /** 規定投球回チェックボックスの対象か（防御率・WHIP のみ true） */
  isRegulated: boolean;
  /** 表示フォーマット */
  format: (value: number) => string;
};

const formatDecimal2 = (value: number) => value.toFixed(2);

/** アウト数を野球慣例の "5.1"（5 回 1/3）表記に変換する */
const formatInnings = (outs: number) => `${Math.floor(outs / 3)}.${outs % 3}`;

const formatCount = (value: number) => String(value);

/** `/pitching-stats` の指標セレクトに並べる項目（防御率をデフォルトの先頭にする） */
export const PITCHING_CATEGORIES = [
  {
    key: "era",
    label: "防御率",
    order: "asc",
    isRegulated: true,
    format: formatDecimal2,
  },
  {
    key: "whip",
    label: "WHIP",
    order: "asc",
    isRegulated: true,
    format: formatDecimal2,
  },
  {
    key: "wins",
    label: "勝利",
    order: "desc",
    isRegulated: false,
    format: formatCount,
  },
  {
    key: "losses",
    label: "敗戦",
    order: "asc",
    isRegulated: false,
    format: formatCount,
  },
  {
    key: "strikeouts",
    label: "奪三振",
    order: "desc",
    isRegulated: false,
    format: formatCount,
  },
  {
    key: "outs",
    label: "投球回",
    order: "desc",
    isRegulated: false,
    format: formatInnings,
  },
  {
    key: "hitsAllowed",
    label: "被安打",
    order: "asc",
    isRegulated: false,
    format: formatCount,
  },
  {
    key: "homeRunsAllowed",
    label: "被本塁打",
    order: "asc",
    isRegulated: false,
    format: formatCount,
  },
  {
    key: "walks",
    label: "与四球",
    order: "asc",
    isRegulated: false,
    format: formatCount,
  },
  {
    key: "hitByPitches",
    label: "与死球",
    order: "asc",
    isRegulated: false,
    format: formatCount,
  },
  {
    key: "earnedRuns",
    label: "自責点",
    order: "asc",
    isRegulated: false,
    format: formatCount,
  },
  {
    key: "runs",
    label: "失点",
    order: "asc",
    isRegulated: false,
    format: formatCount,
  },
  {
    key: "games",
    label: "登板数",
    order: "desc",
    isRegulated: false,
    format: formatCount,
  },
] as const satisfies readonly PitchingStatsCategory[];
