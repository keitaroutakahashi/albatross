import type { StatsCategory } from "@/app/_components/ui/stats-filter-bar";

/** `/contribution-stats` の項目セレクトに並べる項目 */
export const CONTRIBUTION_CATEGORIES = [
  { key: "attendanceRate", label: "出席率" },
  { key: "mvpCount", label: "MVP数" },
] as const satisfies readonly StatsCategory[];

export type ContributionCategoryKey =
  (typeof CONTRIBUTION_CATEGORIES)[number]["key"];
