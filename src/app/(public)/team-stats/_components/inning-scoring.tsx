import { SubSectionGroup } from "@/app/_components/ui/sub-section-group";
import type { InningScoringRow } from "@/app/_utils/stats/inning-scoring";
import { cn } from "@/lib/utils";

type Props = {
  rows: InningScoringRow[];
  /** scored: 回別得点（打撃）, allowed: 回別失点（投手） */
  mode: "scored" | "allowed";
};

const MODE_TITLE = {
  scored: "回別得点",
  allowed: "回別失点",
} as const;

const MODE_BAR_CLASS = {
  scored: "bg-primary",
  allowed: "bg-rose-400",
} as const;

/** 棒の最大の高さに使う領域（px）。最大の回がこの高さになる */
const BAR_AREA_HEIGHT = 112;

/** 回ごとの 1 試合あたりの得点または失点を棒グラフで表示する（イニング得点の記録がある試合のみ） */
export const InningScoring = ({ rows, mode }: Props) => {
  const averages = rows.map((row) =>
    row.games > 0
      ? (mode === "scored" ? row.runsScored : row.runsAllowed) / row.games
      : null,
  );
  const maxAverage = Math.max(0, ...averages.map((v) => v ?? 0));

  return (
    <SubSectionGroup title={MODE_TITLE[mode]}>
      {rows.every((row) => row.games === 0) ? (
        <p className="text-sm text-gray-500">イニング得点の記録がありません</p>
      ) : (
        <div className="flex flex-col gap-y-2">
          <div
            role="img"
            aria-label={`${MODE_TITLE[mode]}（1 試合平均）: ${rows
              .map(
                (row, i) =>
                  `${row.inningNumber} 回 ${averages[i]?.toFixed(2) ?? "-"}`,
              )
              .join("、")}`}
            className="flex items-end gap-x-1"
          >
            {rows.map((row, i) => {
              const average = averages[i];
              const isMax =
                average !== null && average === maxAverage && maxAverage > 0;

              return (
                <div
                  key={row.inningNumber}
                  className="flex min-w-0 flex-1 flex-col items-center gap-y-1"
                >
                  <span
                    className={cn(
                      "text-[10px] tabular-nums md:text-xs",
                      isMax ? "font-bold text-gray-900" : "text-gray-500",
                    )}
                  >
                    {average === null ? "-" : average.toFixed(2)}
                  </span>
                  <div
                    className="flex w-full items-end justify-center"
                    style={{ height: BAR_AREA_HEIGHT }}
                  >
                    {average !== null && (
                      <div
                        className={cn(
                          "w-full max-w-8 rounded-t",
                          MODE_BAR_CLASS[mode],
                          !isMax && "opacity-50",
                        )}
                        style={{
                          height:
                            maxAverage > 0
                              ? Math.max(
                                  2,
                                  (average / maxAverage) * BAR_AREA_HEIGHT,
                                )
                              : 2,
                        }}
                      />
                    )}
                  </div>
                  <span className="border-t border-gray-300 pt-1 text-xs font-bold w-full text-center">
                    {row.inningNumber}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-500">
            回ごとの 1 試合平均。濃い棒が最も多い回です
          </p>
        </div>
      )}
    </SubSectionGroup>
  );
};
