import type { Prisma } from "@/generated/prisma/client";
import type { EventType } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";

const eventInclude = {
  game: {
    include: {
      league: true,
      opponent: true,
      ground: true,
    },
  },
  practice: {
    include: { ground: true },
  },
} satisfies Prisma.EventInclude;

// Event 一覧（試合・練習）を取得。type 指定時はその種別のみに絞り込む
export type EventWithRelations = Awaited<ReturnType<typeof getEvents>>[number];

export const getEvents = async ({
  season,
  type,
}: {
  season: string | number;
  type?: EventType;
}) => {
  return prisma.event.findMany({
    where: {
      season: { season: Number(season) },
      type,
    },
    include: eventInclude,
    orderBy: { date: "desc" },
  });
};

export type RecentEvent = Awaited<
  ReturnType<typeof getRecentCompletedEvents>
>[number];

// 終了したイベント（試合・練習）を、開催日が新しい順に取得（トップページ用）
export const getRecentCompletedEvents = async (limit: number) => {
  return prisma.event.findMany({
    where: { status: "completed" },
    include: eventInclude,
    // 同じ日時のイベントは、後から登録したものを先にする
    orderBy: [{ date: "desc" }, { id: "desc" }],
    take: limit,
  });
};

// Practice 詳細を取得
export type PracticeDetail = NonNullable<
  Awaited<ReturnType<typeof getPractice>>
>;

// Event の種別のみ取得（詳細ページで表示内容を切り替えるために使う）
export const getEventType = async (id: number) => {
  return prisma.event.findUnique({
    where: { id },
    select: { type: true },
  });
};

export const getPractice = async (eventId: number) => {
  return prisma.practice.findUnique({
    where: { eventId },
    include: {
      event: true,
      ground: true,
      practiceMembers: {
        include: { member: true },
        orderBy: { memberId: "asc" },
      },
    },
  });
};
