import { cn } from "@/lib/utils";

export type StackedBarSegment = {
  key: string;
  label: string;
  value: number;
  /** セグメントの背景色（Tailwind のクラス） */
  className: string;
};

type Props = {
  segments: StackedBarSegment[];
  /** スクリーンリーダー向けの、グラフ全体の説明 */
  ariaLabel: string;
  /** 凡例（ラベル・件数・割合）を表示するか。表など別の場所に凡例を出すときは false */
  legend?: boolean;
  className?: string;
};

const percentOf = (value: number, total: number) =>
  total > 0 ? Math.round((value / total) * 100) : 0;

/** 内訳を 100% の横棒で表す。値が 0 のセグメントは描かない */
export const StackedBar = ({
  segments,
  ariaLabel,
  legend = true,
  className,
}: Props) => {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const visible = segments.filter((s) => s.value > 0);

  return (
    <div className={cn("flex flex-col gap-y-2", className)}>
      <div
        role="img"
        aria-label={ariaLabel}
        className="flex h-4 w-full overflow-hidden rounded bg-gray-100"
      >
        {visible.map((s) => (
          <div
            key={s.key}
            title={`${s.label} ${s.value}（${percentOf(s.value, total)}%）`}
            className={cn(
              "h-full border-r border-white last:border-r-0",
              s.className,
            )}
            style={{ width: `${(s.value / total) * 100}%` }}
          />
        ))}
      </div>

      {legend && (
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-700">
          {segments.map((s) => (
            <li key={s.key} className="inline-flex items-center gap-1">
              <span
                className={cn("size-2.5 shrink-0 rounded-sm", s.className)}
                aria-hidden="true"
              />
              {s.label}
              <span className="font-bold tabular-nums">{s.value}</span>
              <span className="text-gray-500 tabular-nums">
                ({percentOf(s.value, total)}%)
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
