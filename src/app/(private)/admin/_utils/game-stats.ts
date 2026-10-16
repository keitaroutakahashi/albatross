import {
  countHits,
  countOpponentErrors,
  sumHitsAllowed,
} from "@/app/_utils/stats/game-totals";
import type { Prisma } from "@/generated/prisma/client";

type Db = Prisma.TransactionClient;

/**
 * 打席結果から、試合の安打（自）・失策（相手）を再計算して保存する。
 * 打席が 1 件もなければ入力なしとして null にする。
 * 打席の登録・更新・削除と同じトランザクションで呼ぶこと。
 */
export const syncBattingTotals = async (db: Db, gameId: number) => {
  const plateAppearances = await db.plateAppearance.findMany({
    where: { gameMember: { gameId } },
    select: { result: true },
  });
  const results = plateAppearances.map((pa) => pa.result);

  await db.game.update({
    where: { id: gameId },
    data:
      results.length === 0
        ? { teamHits: null, opponentErrors: null }
        : {
            teamHits: countHits(results),
            opponentErrors: countOpponentErrors(results),
          },
  });
};

/**
 * 投手成績から、試合の安打（相手）を再計算して保存する。
 * 投手成績が 1 件もなければ入力なしとして null にする。
 * 投手成績の登録・更新・削除と同じトランザクションで呼ぶこと。
 */
export const syncPitchingTotals = async (db: Db, gameId: number) => {
  const pitchingResults = await db.pitchingResult.findMany({
    where: { gameMember: { gameId } },
    select: { hitsAllowed: true },
  });

  await db.game.update({
    where: { id: gameId },
    data: {
      opponentHits:
        pitchingResults.length === 0
          ? null
          : sumHitsAllowed(pitchingResults.map((p) => p.hitsAllowed)),
    },
  });
};
