import type { GameDetail } from "@/app/_features/games/api/getGames";
import type { Position } from "@/generated/prisma/client";

/** 指定ポジションの選手を抽出する */
export function getMembersByPosition(
  gameMembers: GameDetail["gameMembers"],
  position: Position,
) {
  return gameMembers.filter((gm) => gm.position === position);
}
