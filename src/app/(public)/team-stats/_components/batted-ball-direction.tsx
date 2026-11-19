"use client";

import { useState } from "react";
import { type ColumnDef, DataTable } from "@/app/_components/ui/data-table";
import { SubSectionGroup } from "@/app/_components/ui/sub-section-group";
import { positionFullLabel } from "@/app/_constants/labels";
import type {
  BattedBallBatter,
  BattedBallByBatter,
  BattedBallZone,
  BattedBallZoneRow,
} from "@/app/_utils/stats/batted-ball";
import { formatPercent, formatRate } from "@/app/_utils/stats/rate";
import { HeaderWithHint } from "@/app/(public)/team-stats/_components/header-with-hint";
import { StackedBar } from "@/app/(public)/team-stats/_components/stacked-bar";
import { cn } from "@/lib/utils";

type Props = {
  byBatter: Record<BattedBallBatter, BattedBallByBatter>;
};

type Metric = "balls" | "hits" | "outs";

const METRICS: { key: Metric; label: string }[] = [
  { key: "balls", label: "全打球" },
  { key: "hits", label: "安打" },
  { key: "outs", label: "アウト" },
];

const BATTERS: { key: BattedBallBatter; label: string }[] = [
  { key: "all", label: "全体" },
  { key: "right", label: "右打者" },
  { key: "left", label: "左打者" },
];

type FieldZone = Exclude<BattedBallZone, "unknown">;

// ホームベースを下端中央に置き、90 度の扇形でグラウンドを表す
const HOME = { x: 120, y: 175 };
const INFIELD_RADIUS = 100;
const OUTFIELD_RADIUS = 168;
const FAN_HALF_ANGLE = 45;
const INFIELD_STEP = FAN_HALF_ANGLE / 2;
const OUTFIELD_STEP = (FAN_HALF_ANGLE * 2) / 3;

/** 塗りの濃さ。打球 0 でも領域が見えるよう下限を設ける */
const MIN_OPACITY = 0.08;
/** この濃さを超えたら文字色を白にして可読性を保つ */
const LIGHT_TEXT_OPACITY = 0.55;

type Point = { x: number; y: number };

/** ホームから見て、真正面を 0 度・右を正とした角度と距離の位置 */
const point = (angle: number, radius: number): Point => {
  const rad = (angle * Math.PI) / 180;

  return {
    x: HOME.x + radius * Math.sin(rad),
    y: HOME.y - radius * Math.cos(rad),
  };
};

const fmt = (p: Point) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`;

/** 内野を、ホームを要とする扇形で切り出す */
const infieldWedge = (start: number, end: number) =>
  `M ${HOME.x} ${HOME.y} L ${fmt(point(start, INFIELD_RADIUS))} A ${INFIELD_RADIUS} ${INFIELD_RADIUS} 0 0 1 ${fmt(point(end, INFIELD_RADIUS))} Z`;

const outfieldSector = (start: number, end: number) =>
  `M ${fmt(point(start, INFIELD_RADIUS))} L ${fmt(point(start, OUTFIELD_RADIUS))} A ${OUTFIELD_RADIUS} ${OUTFIELD_RADIUS} 0 0 1 ${fmt(point(end, OUTFIELD_RADIUS))} L ${fmt(point(end, INFIELD_RADIUS))} A ${INFIELD_RADIUS} ${INFIELD_RADIUS} 0 0 0 ${fmt(point(start, INFIELD_RADIUS))} Z`;

type Shape =
  | { kind: "path"; zone: FieldZone; d: string; center: Point }
  | { kind: "circle"; zone: FieldZone; center: Point; radius: number };

const wedge = (zone: FieldZone, index: number): Shape => {
  const start = -FAN_HALF_ANGLE + INFIELD_STEP * index;
  const end = start + INFIELD_STEP;
  // 一・三塁側の区画はファウルライン側が狭く、文字がはみ出すので中心側へ寄せる
  const isOuter = index === 0 || index === 3;
  const mid = (start + end) / 2 + (isOuter ? (index === 0 ? 3 : -3) : 0);

  return {
    kind: "path",
    zone,
    d: infieldWedge(start, end),
    center: point(mid, isOuter ? 78 : 72),
  };
};

const sector = (zone: FieldZone, index: number): Shape => {
  const start = -FAN_HALF_ANGLE + OUTFIELD_STEP * index;
  const end = start + OUTFIELD_STEP;

  return {
    kind: "path",
    zone,
    d: outfieldSector(start, end),
    center: point((start + end) / 2, (INFIELD_RADIUS + OUTFIELD_RADIUS) / 2),
  };
};

const SHAPES: Shape[] = [
  sector("left", 0),
  sector("center", 1),
  sector("right", 2),
  wedge("third", 0),
  wedge("shortstop", 1),
  wedge("second", 2),
  wedge("first", 3),
  { kind: "circle", zone: "pitcher", center: point(0, 40), radius: 12 },
  { kind: "circle", zone: "catcher", center: point(0, 13), radius: 10 },
];

const zoneLabel = (zone: BattedBallZone) =>
  zone === "unknown" ? "方向不明" : positionFullLabel[zone];

const SHORT_LABEL: Record<FieldZone, string> = {
  left: "左",
  center: "中",
  right: "右",
  third: "三",
  shortstop: "遊",
  second: "二",
  first: "一",
  pitcher: "投",
  catcher: "捕",
};

const SPRAY_SEGMENTS = [
  { key: "pull", label: "引っ張り", className: "bg-primary" },
  { key: "center", label: "センター", className: "bg-gray-400" },
  { key: "opposite", label: "逆方向", className: "bg-sky-400" },
] as const;

const columns: ColumnDef<BattedBallZoneRow & { share: number }>[] = [
  {
    key: "zone",
    header: "方向",
    align: "left",
    cell: (r) => zoneLabel(r.zone),
  },
  { key: "balls", header: "打球", cell: (r) => r.balls },
  { key: "share", header: "割合", cell: (r) => formatPercent(r.share) },
  { key: "hits", header: "安打", cell: (r) => r.hits },
  { key: "xbh", header: "長打", cell: (r) => r.extraBaseHits },
  { key: "outs", header: "アウト", cell: (r) => r.outs },
  {
    key: "average",
    header: (
      <HeaderWithHint
        label="打球打率"
        hint="三振・四死球を除く打球での打率です。方向ごとに、どこなら安打になっているかを見ます。"
      />
    ),
    cell: (r) => formatRate(r.average),
  },
];

type ToggleGroupProps<T extends string> = {
  legend: string;
  options: { key: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

const ToggleGroup = <T extends string>({
  legend,
  options,
  value,
  onChange,
}: ToggleGroupProps<T>) => (
  <fieldset className="inline-flex min-w-0 overflow-hidden rounded-md border border-gray-300 p-0 text-xs">
    <legend className="sr-only">{legend}</legend>
    {options.map((o) => (
      <button
        key={o.key}
        type="button"
        aria-pressed={value === o.key}
        onClick={() => onChange(o.key)}
        className={cn(
          "px-3 py-1.5 font-bold transition-colors",
          value === o.key
            ? "bg-primary text-primary-foreground"
            : "bg-white text-gray-700 hover:bg-gray-100",
        )}
      >
        {o.label}
      </button>
    ))}
  </fieldset>
);

/**
 * 打球の方向を、グラウンド図の濃淡と表で見る。
 * 安打だけでなくアウトも含めた全打球が対象で、方向ごとの打球打率から強み・弱みが分かる。
 */
export const BattedBallDirection = ({ byBatter }: Props) => {
  const [metric, setMetric] = useState<Metric>("balls");
  const [batter, setBatter] = useState<BattedBallBatter>("all");

  const { zones, spray } = byBatter[batter];
  const rowByZone = new Map(zones.map((row) => [row.zone, row]));
  const unknownBalls = rowByZone.get("unknown")?.balls ?? 0;
  const knownRows = zones.filter((row) => row.zone !== "unknown");
  const knownBalls = knownRows.reduce((sum, row) => sum + row.balls, 0);
  const maxValue = Math.max(...knownRows.map((row) => row[metric]));
  const batterLabel = BATTERS.find((b) => b.key === batter)?.label;

  const tableRows = zones
    .filter((row) => row.balls > 0)
    .map((row) => ({ ...row, share: row.balls / (knownBalls + unknownBalls) }));

  return (
    <SubSectionGroup title="打球方向">
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          <ToggleGroup
            legend="打者"
            options={BATTERS}
            value={batter}
            onChange={setBatter}
          />
          <ToggleGroup
            legend="図に表示する打球"
            options={METRICS}
            value={metric}
            onChange={setMetric}
          />
        </div>

        {knownBalls === 0 ? (
          <p className="text-sm text-gray-500">
            {batter === "all" ? "" : `${batterLabel}の`}
            打球方向の記録がありません
          </p>
        ) : (
          <>
            <div className="flex flex-col items-center gap-y-2">
              <svg
                viewBox="0 0 240 180"
                className="w-full max-w-md"
                role="img"
                aria-label={`打球方向: ${SHAPES.map(
                  ({ zone }) =>
                    `${zoneLabel(zone)} ${rowByZone.get(zone)?.[metric] ?? 0}`,
                ).join("、")}`}
              >
                {SHAPES.map((shape) => {
                  const row = rowByZone.get(shape.zone);
                  const value = row?.[metric] ?? 0;
                  const opacity =
                    maxValue > 0
                      ? MIN_OPACITY + (1 - MIN_OPACITY) * (value / maxValue)
                      : MIN_OPACITY;
                  const textClass =
                    opacity > LIGHT_TEXT_OPACITY
                      ? "fill-white"
                      : "fill-gray-900";
                  const { center } = shape;
                  const isSmall = shape.kind === "circle";
                  const fillProps = {
                    className: "fill-primary stroke-white",
                    fillOpacity: opacity,
                    strokeWidth: 1.5,
                  };

                  return (
                    <g key={shape.zone}>
                      <title>
                        {`${zoneLabel(shape.zone)}: 打球 ${row?.balls ?? 0}、安打 ${row?.hits ?? 0}、アウト ${row?.outs ?? 0}、打球打率 ${formatRate(row?.average ?? null)}`}
                      </title>
                      {shape.kind === "path" ? (
                        <path d={shape.d} {...fillProps} />
                      ) : (
                        <circle
                          cx={shape.center.x}
                          cy={shape.center.y}
                          r={shape.radius}
                          {...fillProps}
                        />
                      )}
                      <text
                        x={center.x}
                        y={center.y - (isSmall ? 2 : 10)}
                        textAnchor="middle"
                        className={cn(
                          isSmall ? "text-[6px]" : "text-[8px]",
                          textClass,
                        )}
                      >
                        {SHORT_LABEL[shape.zone]}
                      </text>
                      <text
                        x={center.x}
                        y={center.y + (isSmall ? 6 : 4)}
                        textAnchor="middle"
                        className={cn(
                          isSmall && "text-[8px]",
                          !isSmall &&
                            (value >= 100 ? "text-[11px]" : "text-[14px]"),
                          "font-bold",
                          textClass,
                        )}
                      >
                        {value}
                      </text>
                      {!isSmall && (
                        <text
                          x={center.x}
                          y={center.y + 14}
                          textAnchor="middle"
                          className={cn("text-[8px]", textClass)}
                        >
                          {formatRate(row?.average ?? null)}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              <p className="text-xs text-gray-500">
                濃いほど多い方向。数字の下は打球打率（全 {knownBalls} 打球
                {unknownBalls > 0
                  ? `、方向不明 ${unknownBalls} 打球を除く`
                  : ""}
                ）
              </p>
            </div>

            <div className="flex flex-col gap-y-2">
              <h4 className="text-sm font-bold">打球の向き</h4>
              {spray.total === 0 ? (
                <p className="text-sm text-gray-500">
                  引っ張り・逆方向を判定できる打球がありません
                </p>
              ) : (
                <>
                  <StackedBar
                    ariaLabel={`打球の向き: 引っ張り ${spray.counts.pull}、センター ${spray.counts.center}、逆方向 ${spray.counts.opposite}`}
                    segments={SPRAY_SEGMENTS.map((s) => ({
                      ...s,
                      value: spray.counts[s.key],
                    }))}
                  />
                  <p className="text-xs text-gray-500">
                    打者から見た向きです。引っ張りは右打者なら三・遊・左、左打者なら一・二・右で、投・捕・中はセンターとします。両打ちは含みません（全体の図と表には両打ちの打球も含みます）
                  </p>
                </>
              )}
            </div>

            <DataTable
              columns={columns}
              data={tableRows}
              keyExtractor={(r) => r.zone}
              sticky={{ count: 1, offsets: ["left-0"] }}
            />
          </>
        )}
      </div>
    </SubSectionGroup>
  );
};
