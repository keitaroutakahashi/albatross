import { clsx } from "clsx";
import Link from "next/link";
import {
  getPitchingLeaders,
  type PitchingLeaders,
} from "@/app/_features/members/api/get-pitching-leaders";
import { getCurrentSeason } from "@/app/_utils/date/date";
import { formatInnings } from "@/app/_utils/stats/innings";

const CATEGORIES = [
  { key: "era", label: "防御率" },
  { key: "win", label: "勝利" },
  { key: "strikeout", label: "奪三振" },
  { key: "inning", label: "投球回" },
] as const satisfies readonly {
  key: keyof PitchingLeaders;
  label: string;
}[];

/**
 * 防御率は小数第 2 位まで、投球回はアウト数を野球慣例の "5.1"（5 回 1/3）表記に変換する。
 */
const formatValue = (key: keyof PitchingLeaders, value: number) => {
  if (key === "era") {
    return value.toFixed(2);
  }

  if (key === "inning") {
    return formatInnings(value);
  }

  return String(value);
};

/**
 * トップページの投手成績上位者セクション。
 * 今シーズンの公式戦を対象に、防御率・勝利・奪三振・投球回の上位 3 位を表示する。
 */
export const PitchingStats = async () => {
  const season = getCurrentSeason();
  const leaders = await getPitchingLeaders(season);

  // 全項目で記録が無い場合は非表示にする
  if (CATEGORIES.every((category) => leaders[category.key].length === 0)) {
    return null;
  }

  return (
    <section className="px-5 py-12 md:py-16">
      <h2 className="text-center font-(family-name:--font-roboto) text-2xl md:text-4xl font-bold tracking-widest">
        PITCHING STATS
      </h2>
      <p className="mt-2 text-center text-xs text-gray-500">
        {season} シーズン / 公式戦
      </p>

      <div className="mt-8 md:mt-10 grid gap-8 md:grid-cols-2 md:gap-x-10">
        {CATEGORIES.map((category) => (
          <div key={category.key}>
            <h3 className="border-b-2 border-primary pb-2 text-sm font-bold">
              {category.label}
            </h3>

            {leaders[category.key].length === 0 ? (
              <p className="py-4 text-sm text-gray-500">記録なし</p>
            ) : (
              <ul>
                {leaders[category.key].map((leader) => (
                  <li
                    key={leader.memberId}
                    className="border-b border-gray-200"
                  >
                    <Link
                      href={`/members/${leader.memberId}`}
                      className="flex items-center gap-x-3 px-2 py-3 transition-colors hover:bg-gray-50"
                    >
                      <span className="w-4 text-center font-(family-name:--font-roboto) text-sm font-bold text-gray-500">
                        {leader.rank}
                      </span>
                      <span className="w-8 text-center text-xs font-bold text-gray-500">
                        {leader.uniformNumber}
                      </span>
                      <span className="min-w-0 flex-1 text-sm font-bold">
                        {leader.name}
                      </span>
                      {/* 1 位は赤で強調する */}
                      <span
                        className={clsx(
                          "font-(family-name:--font-roboto) text-lg font-bold tabular-nums",
                          {
                            "text-red-400": leader.rank === 1,
                          },
                        )}
                      >
                        {formatValue(category.key, leader.value)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
