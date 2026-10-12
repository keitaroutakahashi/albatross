import prisma from "@/lib/prisma";

/** イベントに紐づく試合の ID。試合でないイベント・存在しないイベントは null */
export const findGameId = async (eventId: number): Promise<number | null> => {
  const game = await prisma.game.findUnique({
    where: { eventId },
    select: { id: true },
  });
  return game?.id ?? null;
};

/** gameMemberId が、その試合の出場した選手かを確認する */
export const isGameMemberOf = async (
  gameId: number,
  gameMemberId: number,
): Promise<boolean> => {
  const gameMember = await prisma.gameMember.findFirst({
    where: { id: gameMemberId, gameId },
    select: { id: true },
  });
  return gameMember !== null;
};
