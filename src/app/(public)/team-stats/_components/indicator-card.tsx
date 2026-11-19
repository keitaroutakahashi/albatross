import { HintTooltip } from "@/app/_components/ui/hint-tooltip";
import {
  type Benchmark,
  type BenchmarkLevel,
  evaluateBenchmark,
  toGaugePosition,
  toGaugeZones,
} from "@/app/_utils/stats/benchmarks";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  /** 指標の意味や算出方法の説明 */
  hint: string;
  /** 表示する値（算出できないときは "-"） */
  valueText: string;
  /** 補足（件数など） */
  sub?: string;
  /** 目安と、その値。どちらかがなければゲージと判定は出さない */
  benchmark?: Benchmark;
  value?: number | null;
  /** 目安の境界値の表示形式 */
  formatBoundary?: (value: number) => string;
};

const LEVEL_LABEL: Record<BenchmarkLevel, string> = {
  excellent: "優秀",
  average: "標準",
  poor: "要改善",
};

const BADGE_CLASS: Record<BenchmarkLevel, string> = {
  excellent: "bg-emerald-100 text-emerald-800",
  average: "bg-gray-100 text-gray-700",
  poor: "bg-rose-100 text-rose-800",
};

const ZONE_CLASS: Record<BenchmarkLevel, string> = {
  excellent: "bg-emerald-200",
  average: "bg-gray-200",
  poor: "bg-rose-200",
};

const percent = (position: number) => `${position * 100}%`;

/** 指標の値を、優秀・標準・要改善の帯の上にマーカーで示すカード */
export const IndicatorCard = ({
  label,
  hint,
  valueText,
  sub,
  benchmark,
  value = null,
  formatBoundary = String,
}: Props) => {
  const level =
    benchmark && value !== null ? evaluateBenchmark(benchmark, value) : null;

  return (
    <div className="flex flex-col gap-y-1.5 rounded-lg border border-gray-200 bg-white p-3">
      <div className="flex items-center justify-between gap-x-1">
        <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-700">
          {label}
          <HintTooltip text={hint} />
        </span>
        {level && (
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-[10px] font-bold",
              BADGE_CLASS[level],
            )}
          >
            {LEVEL_LABEL[level]}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-x-1.5">
        <span className="text-2xl font-bold tabular-nums">{valueText}</span>
        {sub && <span className="text-xs text-gray-500">{sub}</span>}
      </div>

      {benchmark && (
        <div className="mt-auto pt-1">
          <div className="relative h-2 overflow-hidden rounded-full">
            {toGaugeZones(benchmark).map((zone) => (
              <div
                key={zone.level}
                className={cn("absolute inset-y-0", ZONE_CLASS[zone.level])}
                style={{
                  left: percent(zone.from),
                  width: percent(zone.to - zone.from),
                }}
              />
            ))}
          </div>
          {value !== null && (
            <div className="relative h-0">
              <span
                className="absolute -top-3 block h-4 w-1 -translate-x-1/2 rounded-full bg-gray-900 ring-2 ring-white"
                style={{ left: percent(toGaugePosition(benchmark, value)) }}
                aria-hidden="true"
              />
            </div>
          )}
          <p className="mt-1.5 text-[10px] leading-tight text-gray-500">
            {benchmark.better === "higher"
              ? `優秀 ${formatBoundary(benchmark.excellent)} 以上 / 要改善 ${formatBoundary(benchmark.poor)} 未満`
              : `優秀 ${formatBoundary(benchmark.excellent)} 以下 / 要改善 ${formatBoundary(benchmark.poor)} 超`}
          </p>
        </div>
      )}
    </div>
  );
};

/** 指標カードを並べるグリッド。目安は暫定であることを添える */
export const IndicatorGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-y-2">
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">{children}</div>
    <p className="text-xs text-gray-500">
      優秀・標準・要改善の目安は、草野球（7 回制）を想定した暫定の基準です
    </p>
  </div>
);
