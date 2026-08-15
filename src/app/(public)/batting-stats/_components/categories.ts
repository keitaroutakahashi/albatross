import type { StatsCategory } from "@/app/_components/ui/stats-filter-bar";
import type { BattingStatRow } from "@/app/_features/members/api/get-batting-stats";

export type BattingStatsCategory = StatsCategory & {
  key: keyof BattingStatRow;
  /** 率系の指標か（規定打席フィルタと `.317` 表記の対象になる） */
  isRate: boolean;
};

/** `/batting-stats` の指標セレクトに並べる項目（打率をデフォルトの先頭にする） */
export const BATTING_CATEGORIES = [
  { key: "average", label: "打率", isRate: true },
  { key: "onBasePercentage", label: "出塁率", isRate: true },
  { key: "sluggingPercentage", label: "長打率", isRate: true },
  { key: "ops", label: "OPS", isRate: true },
  { key: "homeRuns", label: "本塁打", isRate: false },
  { key: "rbi", label: "打点", isRate: false },
  { key: "hits", label: "安打", isRate: false },
  { key: "stolenBases", label: "盗塁", isRate: false },
  { key: "doubles", label: "二塁打", isRate: false },
  { key: "triples", label: "三塁打", isRate: false },
  { key: "walks", label: "四死球", isRate: false },
  { key: "strikeouts", label: "三振", isRate: false },
  { key: "sacrificeHits", label: "犠打", isRate: false },
  { key: "sacrificeFlies", label: "犠飛", isRate: false },
  { key: "games", label: "試合", isRate: false },
  { key: "plateAppearances", label: "打席", isRate: false },
  { key: "atBats", label: "打数", isRate: false },
] as const satisfies readonly BattingStatsCategory[];
