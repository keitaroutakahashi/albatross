import type { GameResult } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";

/** イベントに紐づく試合の ID。試合でないイベント・存在しないイベントは null */
export const findGameId = async (eventId: number): Promise<number | null> => {
  const game = await prisma.game.findUnique({
    where: { eventId },
    select: { id: true },
  });
  return game?.id ?? null;
};

/** gameMemberId が、その試合のオーダーに入っている選手かを確認する */
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

/** 同じ試合で、すでにその登板順の投手がいるか。更新時は、自分自身（excludeId）を除く */
export const isPitchingOrderTaken = async (
  gameId: number,
  pitchingOrder: number,
  excludeId?: number,
): Promise<boolean> => {
  const found = await prisma.pitchingResult.findFirst({
    where: {
      pitchingOrder,
      gameMember: { gameId },
      id: excludeId === undefined ? undefined : { not: excludeId },
    },
    select: { id: true },
  });
  return found !== null;
};

/** 試合の結果。まだ判定できない試合は null */
export const findGameResult = async (
  gameId: number,
): Promise<GameResult | null> => {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    select: { result: true },
  });
  return game?.result ?? null;
};

/** 同じ試合で、すでに責任投手がいるか。更新時は、自分自身（excludeId）を除く */
export const isResponsiblePitcherTaken = async (
  gameId: number,
  excludeId?: number,
): Promise<boolean> => {
  const found = await prisma.pitchingResult.findFirst({
    where: {
      isResponsible: true,
      gameMember: { gameId },
      id: excludeId === undefined ? undefined : { not: excludeId },
    },
    select: { id: true },
  });
  return found !== null;
};
