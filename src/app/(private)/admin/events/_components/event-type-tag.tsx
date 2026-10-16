import { gameTypeLabel } from "@/app/_constants/labels";
import type { EventType, GameType } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

type Props = {
  type: EventType;
  /** 試合のときの種別 */
  gameType?: GameType;
};

/**
 * 一覧でイベントの種類を示すラベル。
 * 試合は公式戦・練習試合を区別し、種別が未定なら単に「試合」とする。
 * 練習はタイトルが「練習」なので、ラベルは付けない。
 * 紺・金はブランドカラーのため使わない。赤は状態（中止）で使っている。
 */
export const EventTypeTag = ({ type, gameType }: Props) => {
  if (type !== "game" || !gameType || gameType === "undecided") return null;

  return (
    <span
      className={cn(
        "shrink-0 rounded px-1.5 py-0.5 text-xs font-bold",
        gameType === "official" && "bg-violet-100 text-violet-700",
        gameType === "practice" && "bg-pink-100 text-pink-700",
      )}
    >
      {gameTypeLabel[gameType]}
    </span>
  );
};
