import { clsx } from "clsx";
import Link from "next/link";
import {
  type BattingLeaders as BattingLeadersType,
  getBattingLeaders,
} from "@/app/_features/members/api/get-batting-leaders";
import { getCurrentSeason } from "@/app/_utils/date/date";

const CATEGORIES = [
  { key: "average", label: "打率" },
  { key: "rbi", label: "打点" },
  { key: "homeRun", label: "本塁打" },
  { key: "stolenBase", label: "盗塁" },
] as const satisfies readonly {
  key: keyof BattingLeadersType;
  label: string;
}[];

/** 打率は "1.000" 以外は先頭の 0 を落として ".333" 表記にする */
const formatValue = (key: keyof BattingLeadersType, value: number) => {
  if (key !== "average") {
    return String(value);
  }

  return value >= 1 ? "1.000" : value.toFixed(3).slice(1);
};

/**
 * トップページの打撃成績上位者セクション。
 * 今シーズンの公式戦を対象に、打率・打点・本塁打・盗塁の上位 3 位を表示する。
 */
export const BattingLeaders = async () => {
  const season = getCurrentSeason();
  const leaders = await getBattingLeaders(season);

  // 全項目で記録が無い場合は非表示にする
  if (CATEGORIES.every((category) => leaders[category.key].length === 0)) {
    return null;
  }

  return (
    <section className="px-5 py-12 md:py-16">
      <h2 className="text-center font-(family-name:--font-roboto) text-2xl md:text-4xl font-bold tracking-widest">
        BATTING LEADERS
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
                      {/* 1 位は赤・2 位は青で強調する */}
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
