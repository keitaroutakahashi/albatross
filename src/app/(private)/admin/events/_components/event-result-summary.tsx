import { getGameTotals } from "@/app/(private)/admin/_utils/event-display";
import { cn } from "@/lib/utils";

type Props = {
  /** 対戦相手の名前。未設定のときは「相手」と表示する */
  opponentName: string | null;
  /** 自チームが先攻か。先攻を左の列に置く */
  isFirstBatting: boolean | null;
  game: {
    teamScore: number | null;
    opponentScore: number | null;
    teamForfeitedRuns: number | null;
    opponentForfeitedRuns: number | null;
    teamHits: number | null;
    opponentHits: number | null;
    teamErrors: number | null;
    opponentErrors: number | null;
  };
};

type Row = {
  label: string;
  team: number | null;
  opponent: number | null;
  /** 最終的な得点の行。大きく表示する */
  strong?: boolean;
  /** 前の行との間に区切り線を入れる（合計行） */
  ruled?: boolean;
  /** 前の行との間に区切り線を入れる */
  divided?: boolean;
};

const Cell = ({
  value,
  strong,
}: {
  value: number | null;
  strong?: boolean;
}) => (
  <span
    className={cn(
      "text-center tabular-nums",
      value === null && "text-muted-foreground",
      strong ? "text-2xl font-bold" : "text-base font-medium",
    )}
  >
    {value ?? "–"}
  </span>
);

/**
 * 試合結果の表示。入力欄は持たず、すべて記録から自動で設定される値を、
 * チームごとの列にそろえて見比べられるようにする。試合のときだけ使う。
 * - 得点・献上点・失策（自）: 「イニングごとの得点」
 * - 安打（自）・失策（相手）: 「打席の結果」
 * - 安打（相手）: 「投手の成績」
 */
export const EventResultSummary = ({
  opponentName,
  isFirstBatting,
  game,
}: Props) => {
  const totals = getGameTotals(game);
  // 献上点はないことが多いため、どちらかにあるときだけ、献上点と合計の行を出す。
  // ないときは、得点がそのまま最終的な得点になる
  const hasForfeitedRuns =
    (game.teamForfeitedRuns ?? 0) > 0 || (game.opponentForfeitedRuns ?? 0) > 0;
  const scoreRows: Row[] = hasForfeitedRuns
    ? [
        { label: "得点", team: game.teamScore, opponent: game.opponentScore },
        {
          label: "献上点",
          team: game.teamForfeitedRuns ?? 0,
          opponent: game.opponentForfeitedRuns ?? 0,
        },
        {
          label: "合計",
          team: totals?.team ?? null,
          opponent: totals?.opponent ?? null,
          strong: true,
          ruled: true,
        },
      ]
    : [
        {
          label: "得点",
          team: game.teamScore,
          opponent: game.opponentScore,
          strong: true,
        },
      ];
  const rows: Row[] = [
    ...scoreRows,
    {
      label: "安打",
      team: game.teamHits,
      opponent: game.opponentHits,
      divided: true,
    },
    { label: "失策", team: game.teamErrors, opponent: game.opponentErrors },
  ];
  const columns = [
    { key: "team" as const, name: "Albatross" },
    { key: "opponent" as const, name: opponentName ?? "相手" },
  ];
  const ordered = isFirstBatting === false ? [...columns].reverse() : columns;

  return (
    <section className="p-4">
      <h2 className="pb-3 text-base font-bold">試合結果</h2>
      <div className="rounded-xl border bg-background">
        <div className="grid grid-cols-[4.5rem_1fr_1fr] items-center gap-x-2 border-b bg-muted/50 px-4 py-2 text-xs font-bold">
          <span />
          {ordered.map((column) => (
            <span key={column.key} className="truncate text-center">
              {column.name}
            </span>
          ))}
        </div>
        <div className="flex flex-col px-4">
          {rows.map((row) => (
            <div
              key={row.label}
              className={cn(
                "grid grid-cols-[4.5rem_1fr_1fr] items-center gap-x-2 py-2.5",
                row.divided && "mt-1 border-t pt-3.5",
                row.ruled && "border-t",
              )}
            >
              <span className="text-sm text-muted-foreground">{row.label}</span>
              {ordered.map((column) => (
                <Cell
                  key={column.key}
                  value={row[column.key]}
                  strong={row.strong}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="pt-2 text-xs text-muted-foreground">
        得点は「イニングごとの得点」、安打・失策は「打席の結果」「投手の成績」の入力から自動で設定されます。
      </p>
    </section>
  );
};
