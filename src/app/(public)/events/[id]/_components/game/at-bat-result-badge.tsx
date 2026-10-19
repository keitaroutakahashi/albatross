import { cn } from "@/lib/utils";

/**
 * 得点圏（二塁または三塁に走者がいる状況）の打席の示し方。
 * バッジの背景色は結果の種類（安打・四死球・アウト）を表しているため、色ではなく形で示す。
 * - ring: バッジの外側に、二重の枠線を付ける
 * - dot: バッジの右上に、小さな紺色（ブランドカラー）の薄い点を付ける。白い縁で、青いバッジの上でも見分けられる
 * 見比べるために切り替えられるようにしている。決まったら、使わない方を削除する。
 */
// 初期値の "dot" に型が絞り込まれて、切り替えた側の分岐が到達不能と見なされないよう、型を広げておく
export const SCORING_POSITION_STYLE = "dot" as "ring" | "dot";

const RING_CLASS = "ring-2 ring-gray-900 ring-offset-2 ring-offset-white";
const DOT_CLASS =
  "absolute -top-0.5 -right-0.5 size-2 rounded-full bg-primary/60 ring-1 ring-white/80";

type Props = {
  text: string;
  colorClass: string;
  rbi: number;
  isScoringPosition?: boolean;
};

export const AtBatResultBadge = ({
  text,
  colorClass,
  rbi,
  isScoringPosition = false,
}: Props) => {
  return (
    <div
      title={isScoringPosition ? "得点圏" : undefined}
      className={cn(
        "relative p-1 @content:p-2 text-xs @content:text-sm rounded text-white font-bold",
        colorClass,
        isScoringPosition && SCORING_POSITION_STYLE === "ring" && RING_CLASS,
      )}
    >
      {text}
      {rbi > 0 && <span className="text-xs @content:text-sm">({rbi})</span>}
      {isScoringPosition && SCORING_POSITION_STYLE === "dot" && (
        <span aria-hidden className={DOT_CLASS} />
      )}
      {isScoringPosition && <span className="sr-only">（得点圏）</span>}
    </div>
  );
};

/** 得点圏の印の凡例。表の下に、実際のバッジと同じ印の見本と説明を出す */
export const ScoringPositionLegend = () => (
  <p className="mt-3 flex items-center gap-2 text-xs text-gray-600">
    <span
      aria-hidden
      className={cn(
        "relative inline-block size-4 rounded bg-gray-300",
        SCORING_POSITION_STYLE === "ring" && RING_CLASS,
      )}
    >
      {SCORING_POSITION_STYLE === "dot" && <span className={DOT_CLASS} />}
    </span>
    {SCORING_POSITION_STYLE === "ring" ? "二重の枠線は" : "右上の小さな点は"}
    得点圏での打席
  </p>
);
