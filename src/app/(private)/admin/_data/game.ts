import { requireAdmin } from "@/app/(private)/admin/_utils/auth";
import prisma from "@/lib/prisma";

/** イベント配下の試合データ。イベントが試合でなければ null */
export const getGameOfEvent = async (eventId: number) => {
  await requireAdmin();
  return prisma.game.findUnique({
    where: { eventId },
    include: { event: true, opponent: true },
  });
};

/** イベント配下の練習データ。イベントが練習でなければ null */
export const getPracticeOfEvent = async (eventId: number) => {
  await requireAdmin();
  return prisma.practice.findUnique({
    where: { eventId },
    include: { event: true, practiceMembers: true },
  });
};

export const getInnings = async (gameId: number) => {
  await requireAdmin();
  return prisma.inning.findMany({
    where: { gameId },
    orderBy: { inningNumber: "asc" },
  });
};

/** 出場メンバーを打順・背番号順で取得する */
export const getGameMembers = async (gameId: number) => {
  await requireAdmin();
  return prisma.gameMember.findMany({
    where: { gameId },
    include: { member: true, pitchingResult: { select: { id: true } } },
    orderBy: [{ memberType: "asc" }, { battingOrder: "asc" }, { id: "asc" }],
  });
};

/** 出場メンバー登録フォーム用。現役メンバーと、すでに出場登録済みのメンバー */
export const getLineupCandidates = async (gameId: number) => {
  await requireAdmin();
  const [members, gameMembers] = await Promise.all([
    prisma.member.findMany({
      where: {
        OR: [{ isActive: true }, { gameMembers: { some: { gameId } } }],
      },
      orderBy: { name: "asc" },
    }),
    prisma.gameMember.findMany({ where: { gameId } }),
  ]);

  return { members, gameMembers };
};

export const getPlateAppearances = async (gameId: number) => {
  await requireAdmin();
  return prisma.plateAppearance.findMany({
    where: { gameMember: { gameId } },
    include: { gameMember: { include: { member: true } } },
    orderBy: [
      { gameMember: { battingOrder: "asc" } },
      { gameMember: { id: "asc" } },
      { atBatInGame: "asc" },
    ],
  });
};

export const getPlateAppearance = async (gameId: number, id: number) => {
  await requireAdmin();
  return prisma.plateAppearance.findFirst({
    where: { id, gameMember: { gameId } },
  });
};

export const getPitchingResults = async (gameId: number) => {
  await requireAdmin();
  return prisma.pitchingResult.findMany({
    where: { gameMember: { gameId } },
    include: { gameMember: { include: { member: true } } },
    orderBy: { pitchingOrder: "asc" },
  });
};

export const getPitchingResult = async (gameId: number, id: number) => {
  await requireAdmin();
  return prisma.pitchingResult.findFirst({
    where: { id, gameMember: { gameId } },
  });
};

/** イベント編集画面に出す、関連データの件数 */
export const getGameRelatedCounts = async (gameId: number) => {
  await requireAdmin();
  const [innings, gameMembers, plateAppearances, pitchingResults] =
    await Promise.all([
      prisma.inning.count({ where: { gameId } }),
      prisma.gameMember.count({ where: { gameId } }),
      prisma.plateAppearance.count({ where: { gameMember: { gameId } } }),
      prisma.pitchingResult.count({ where: { gameMember: { gameId } } }),
    ]);

  return { innings, gameMembers, plateAppearances, pitchingResults };
};

/** 練習参加メンバー登録フォーム用 */
export const getPracticeCandidates = async (practiceId: number) => {
  await requireAdmin();
  return prisma.member.findMany({
    where: {
      OR: [{ isActive: true }, { practiceMembers: { some: { practiceId } } }],
    },
    orderBy: { name: "asc" },
  });
};
