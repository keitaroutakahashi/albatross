import { SubSectionGroup } from "@/app/_components/ui/sub-section-group";
import type {
  HitDirectionRow,
  HitZone,
} from "@/app/_features/members/api/get-member-stats";
import { cn } from "@/lib/utils";

type Props = {
  rows: HitDirectionRow[];
};

// 描画領域（viewBox）。ホームベースを下端中央に置き、90 度の扇形でグラウンドを表す
const HOME = { x: 100, y: 140 };
const INFIELD_RADIUS = 55;
const OUTFIELD_RADIUS = 130;
const FAN_HALF_ANGLE = 45;
const OUTFIELD_ANGLE = (FAN_HALF_ANGLE * 2) / 3;

/** 塗りの濃さ。安打 0 でも領域が見えるよう下限を設ける */
const MIN_OPACITY = 0.08;
/** この濃さを超えたら文字色を白にして可読性を保つ */
const LIGHT_TEXT_OPACITY = 0.55;

const ZONE_LABEL: Record<HitZone, string> = {
  infield: "内野",
  left: "左",
  center: "中",
  right: "右",
  unknown: "方向不明",
};

/** ホームから見て、真正面を 0 度・右を正とした角度と距離の位置 */
const point = (angle: number, radius: number) => {
  const rad = (angle * Math.PI) / 180;

  return {
    x: HOME.x + radius * Math.sin(rad),
    y: HOME.y - radius * Math.cos(rad),
  };
};

const toPath = (points: ({ x: number; y: number } | string)[]) =>
  points
    .map((p) =>
      typeof p === "string" ? p : `${p.x.toFixed(2)} ${p.y.toFixed(2)}`,
    )
    .join(" ");

const infieldPath = () => {
  const from = point(-FAN_HALF_ANGLE, INFIELD_RADIUS);
  const to = point(FAN_HALF_ANGLE, INFIELD_RADIUS);

  return toPath([
    `M ${HOME.x} ${HOME.y} L`,
    from,
    `A ${INFIELD_RADIUS} ${INFIELD_RADIUS} 0 0 1`,
    to,
    "Z",
  ]);
};

const outfieldPath = (startAngle: number, endAngle: number) =>
  toPath([
    "M",
    point(startAngle, INFIELD_RADIUS),
    "L",
    point(startAngle, OUTFIELD_RADIUS),
    `A ${OUTFIELD_RADIUS} ${OUTFIELD_RADIUS} 0 0 1`,
    point(endAngle, OUTFIELD_RADIUS),
    "L",
    point(endAngle, INFIELD_RADIUS),
    `A ${INFIELD_RADIUS} ${INFIELD_RADIUS} 0 0 0`,
    point(startAngle, INFIELD_RADIUS),
    "Z",
  ]);

type FieldZone = {
  zone: Exclude<HitZone, "unknown">;
  path: string;
  /** ラベルを置く位置 */
  center: { x: number; y: number };
};

const outfieldZone = (zone: FieldZone["zone"], index: number): FieldZone => {
  const start = -FAN_HALF_ANGLE + OUTFIELD_ANGLE * index;
  const end = start + OUTFIELD_ANGLE;

  return {
    zone,
    path: outfieldPath(start, end),
    center: point(
      (start + end) / 2,
      (INFIELD_RADIUS + OUTFIELD_RADIUS) / 2 + 2,
    ),
  };
};

const FIELD_ZONES: FieldZone[] = [
  { zone: "infield", path: infieldPath(), center: point(0, 30) },
  outfieldZone("left", 0),
  outfieldZone("center", 1),
  outfieldZone("right", 2),
];

/** 安打の打球方向を、グラウンド図の濃淡と本数で表示する */
export const HitDirection = ({ rows }: Props) => {
  const rowByZone = new Map(rows.map((row) => [row.zone, row]));
  const unknownHits = rowByZone.get("unknown")?.hits ?? 0;
  // 割合・濃淡は図に描く領域だけを対象にする（方向不明は含めない）
  const fieldHits = rows.reduce((sum, row) => sum + row.hits, 0) - unknownHits;
  const maxHits = Math.max(
    ...FIELD_ZONES.map(({ zone }) => rowByZone.get(zone)?.hits ?? 0),
  );

  return (
    <SubSectionGroup title="安打方向">
      {fieldHits === 0 ? (
        <p className="text-sm text-gray-500">
          打球方向の記録がある安打がありません
        </p>
      ) : (
        <div className="flex flex-col items-center gap-y-2">
          <svg
            viewBox="0 0 200 150"
            className="w-full max-w-md"
            role="img"
            aria-label={`安打方向: ${FIELD_ZONES.map(
              ({ zone }) =>
                `${ZONE_LABEL[zone]} ${rowByZone.get(zone)?.hits ?? 0}本`,
            ).join("、")}`}
          >
            {FIELD_ZONES.map(({ zone, path, center }) => {
              const row = rowByZone.get(zone);
              const hits = row?.hits ?? 0;
              const opacity =
                MIN_OPACITY + (1 - MIN_OPACITY) * (hits / maxHits);
              const percent = Math.round((hits / fieldHits) * 100);
              const textClass = cn(
                opacity > LIGHT_TEXT_OPACITY ? "fill-white" : "fill-gray-900",
              );

              return (
                <g key={zone}>
                  <title>
                    {`${ZONE_LABEL[zone]}: 単打${row?.singles ?? 0} 二塁打${row?.doubles ?? 0} 三塁打${row?.triples ?? 0} 本塁打${row?.homeRuns ?? 0}`}
                  </title>
                  <path
                    d={path}
                    className="fill-primary stroke-white"
                    fillOpacity={opacity}
                    strokeWidth={1.5}
                  />
                  <text
                    x={center.x}
                    y={center.y - 9}
                    textAnchor="middle"
                    className={cn("text-[7px]", textClass)}
                  >
                    {ZONE_LABEL[zone]}
                  </text>
                  <text
                    x={center.x}
                    y={center.y + 4}
                    textAnchor="middle"
                    className={cn("text-[14px] font-bold", textClass)}
                  >
                    {hits}
                  </text>
                  <text
                    x={center.x}
                    y={center.y + 13}
                    textAnchor="middle"
                    className={cn("text-[7px]", textClass)}
                  >
                    {percent}%
                  </text>
                </g>
              );
            })}
          </svg>

          <p className="text-xs text-gray-500">
            濃いほど安打が多い方向（全 {fieldHits} 本
            {unknownHits > 0 ? `、方向不明 ${unknownHits} 本を除く` : ""}）
          </p>
        </div>
      )}
    </SubSectionGroup>
  );
};
