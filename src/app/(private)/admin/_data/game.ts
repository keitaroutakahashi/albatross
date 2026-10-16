import { requireAccess } from "@/app/(private)/admin/_utils/auth";
import prisma from "@/lib/prisma";

/** イベント配下の試合データ。イベントが試合でなければ null */
export const getGameOfEvent = async (eventId: number) => {
  await requireAccess("events");
  return prisma.game.findUnique({
    where: { eventId },
    include: { event: true, opponent: true },
  });
};

/**
 * 参加メンバー登録用。試合・練習どちらでも使う。
 * 現役メンバーと、すでに参加メンバーに入っているメンバーを選択肢にする。
 */
export const getEventParticipation = async (eventId: number) => {
  await requireAccess("events");
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      game: { select: { participants: { select: { memberId: true } } } },
      practice: { select: { practiceMembers: { select: { memberId: true } } } },
    },
  });
  if (!event || (!event.game && !event.practice)) return null;

  const selectedMemberIds = (
    event.game?.participants ??
    event.practice?.practiceMembers ??
    []
  ).map((m) => m.memberId);
  const members = await prisma.member.findMany({
    where: { OR: [{ isActive: true }, { id: { in: selectedMemberIds } }] },
    orderBy: { name: "asc" },
  });

  return { selectedMemberIds, members };
};

export const getInnings = async (gameId: number) => {
  await requireAccess("events");
  return prisma.inning.findMany({
    where: { gameId },
    orderBy: { inningNumber: "asc" },
  });
};

/** オーダーの選手を打順・背番号順で取得する */
export const getGameMembers = async (gameId: number) => {
  await requireAccess("events");
  return prisma.gameMember.findMany({
    where: { gameId },
    include: { member: true, pitchingResult: { select: { id: true } } },
    orderBy: [{ memberType: "asc" }, { battingOrder: "asc" }, { id: "asc" }],
  });
};

/** オーダーの登録フォーム用。選べるのは、この試合の参加メンバーだけ */
export const getLineupCandidates = async (gameId: number) => {
  await requireAccess("events");
  const [participants, gameMembers] = await Promise.all([
    prisma.gameParticipant.findMany({
      where: { gameId },
      include: { member: true },
      orderBy: { member: { name: "asc" } },
    }),
    prisma.gameMember.findMany({ where: { gameId } }),
  ]);

  return { members: participants.map((p) => p.member), gameMembers };
};

/** 打席入力の入口。オーダーの選手を、スタメン（打順順）→ ベンチの順に、打席結果つきで取得する */
export const getLineupWithAtBats = async (gameId: number) => {
  await requireAccess("events");
  return prisma.gameMember.findMany({
    where: { gameId },
    include: {
      member: true,
      plateAppearances: { orderBy: { atBatInGame: "asc" } },
    },
    orderBy: [
      { memberType: "asc" },
      { battingOrder: { sort: "asc", nulls: "last" } },
      { id: "asc" },
    ],
  });
};

/** 1 人分の打席入力用。他の試合の選手は取得しない */
export const getGameMemberWithAtBats = async (
  gameId: number,
  gameMemberId: number,
) => {
  await requireAccess("events");
  return prisma.gameMember.findFirst({
    where: { id: gameMemberId, gameId },
    include: {
      member: true,
      plateAppearances: { orderBy: { atBatInGame: "asc" } },
    },
  });
};

export const getPitchingResults = async (gameId: number) => {
  await requireAccess("events");
  return prisma.pitchingResult.findMany({
    where: { gameMember: { gameId } },
    include: { gameMember: { include: { member: true } } },
    orderBy: { pitchingOrder: "asc" },
  });
};

/** 投手成績を追加するときの、登板順の初期値（登録済みの最大値 + 1。なければ 1） */
export const getNextPitchingOrder = async (gameId: number) => {
  await requireAccess("events");
  const { _max } = await prisma.pitchingResult.aggregate({
    where: { gameMember: { gameId } },
    _max: { pitchingOrder: true },
  });
  return (_max.pitchingOrder ?? 0) + 1;
};

export const getPitchingResult = async (gameId: number, id: number) => {
  await requireAccess("events");
  return prisma.pitchingResult.findFirst({
    where: { id, gameMember: { gameId } },
  });
};

/** イベント編集画面に出す、関連データの件数 */
export const getGameRelatedCounts = async (gameId: number) => {
  await requireAccess("events");
  const [
    participants,
    innings,
    gameMembers,
    plateAppearances,
    pitchingResults,
  ] = await Promise.all([
    prisma.gameParticipant.count({ where: { gameId } }),
    prisma.inning.count({ where: { gameId } }),
    prisma.gameMember.count({ where: { gameId } }),
    prisma.plateAppearance.count({ where: { gameMember: { gameId } } }),
    prisma.pitchingResult.count({ where: { gameMember: { gameId } } }),
  ]);

  return {
    participants,
    innings,
    gameMembers,
    plateAppearances,
    pitchingResults,
  };
};

/** MVP の登録フォーム用。選べるのは、この試合の参加メンバーだけ。MVP は表示順で返す */
export const getMvpEditorData = async (gameId: number) => {
  await requireAccess("events");
  const [participants, mvps] = await Promise.all([
    prisma.gameParticipant.findMany({
      where: { gameId },
      include: { member: true },
      orderBy: { member: { name: "asc" } },
    }),
    prisma.gameMvp.findMany({ where: { gameId }, orderBy: { order: "asc" } }),
  ]);

  return {
    candidates: participants.map((p) => ({
      memberId: p.memberId,
      name: p.member.name,
      uniformNumber: p.member.uniformNumber,
    })),
    mvps,
  };
};
