import { getJstDayRange } from "@/app/_utils/date/date";
import type { Prisma } from "@/generated/prisma/client";

type Db = Prisma.TransactionClient;

/**
 * 同日の試合に、日時の早い順で 1, 2, … と番号を付ける。
 * 日時が同じ試合は、登録順（id の小さい順）にする。
 */
export const assignGameNumbers = (
  games: { id: number; date: Date }[],
): Map<number, number> => {
  const sorted = [...games].sort(
    (a, b) => a.date.getTime() - b.date.getTime() || a.id - b.id,
  );
  return new Map(sorted.map((game, index) => [game.id, index + 1]));
};

/**
 * date と同じ日（日本時間）の試合の番号を、日時順に振り直す。
 * 試合の登録・日時の変更・削除と同じトランザクションで呼ぶこと。
 */
export const renumberGamesOfDay = async (db: Db, date: Date) => {
  const { start, end } = getJstDayRange(date);
  const games = await db.game.findMany({
    where: { event: { date: { gte: start, lt: end } } },
    select: { id: true, gameNumber: true, event: { select: { date: true } } },
  });

  const numbers = assignGameNumbers(
    games.map((g) => ({ id: g.id, date: g.event.date })),
  );
  for (const game of games) {
    const gameNumber = numbers.get(game.id);
    if (gameNumber !== undefined && gameNumber !== game.gameNumber) {
      await db.game.update({ where: { id: game.id }, data: { gameNumber } });
    }
  }
};

/** 2 つの日時が、日本時間で同じ日か */
export const isSameJstDay = (a: Date, b: Date): boolean =>
  getJstDayRange(a).start.getTime() === getJstDayRange(b).start.getTime();
