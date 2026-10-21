import type { GameDetail } from "@/app/_features/games/api/get-games";

/** 投手成績がある選手を、登板順（先発が先頭）で抽出する */
export function getPitchers(gameMembers: GameDetail["gameMembers"]) {
  return gameMembers
    .filter((gm) => gm.pitchingResult !== null)
    .sort(
      (a, b) =>
        (a.pitchingResult?.pitchingOrder ?? 0) -
        (b.pitchingResult?.pitchingOrder ?? 0),
    );
}

/** 責任投手（勝ち投手・負け投手になる投手）を抽出する */
export function getResponsiblePitcher(gameMembers: GameDetail["gameMembers"]) {
  return gameMembers.find((gm) => gm.pitchingResult?.isResponsible);
}
