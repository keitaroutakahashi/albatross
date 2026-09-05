import type { GameDetail } from "@/app/_features/games/api/get-games";

/** 投手成績がある選手を抽出する */
export function getPitchers(gameMembers: GameDetail["gameMembers"]) {
  return gameMembers.filter((gm) => gm.pitchingResult !== null);
}

/** 勝敗が記録された投手（pitchingResult & decision が存在する）を抽出する */
export function getMemberWithPitchingDecision(
  gameMembers: GameDetail["gameMembers"],
) {
  return gameMembers.find(
    (gm) => gm.pitchingResult !== null && gm.pitchingResult.decision !== null,
  );
}
