"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import {
  eventCreateSchema,
  eventMatchupSchema,
  eventReviewSchema,
  eventScheduleSchema,
} from "@/app/(private)/admin/_schemas/event";
import { MVPS_ERROR_KEY, parseMvps } from "@/app/(private)/admin/_schemas/mvp";
import {
  parseForm,
  revalidateAll,
  toDeleteFailureState,
  toFailureState,
  toFieldErrorState,
} from "@/app/(private)/admin/_utils/action";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import { requireAccess } from "@/app/(private)/admin/_utils/auth";
import {
  isSameJstDay,
  renumberGamesOfDay,
} from "@/app/(private)/admin/_utils/game-number";
import { Prisma } from "@/generated/prisma/client";
import { EventStatus } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";

const EVENTS_PATH = "/admin/events";

export const createEvent = async (
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  await requireAccess("events");
  const parsed = parseForm(eventCreateSchema, formData);
  if (!parsed.success) return parsed.state;
  const { data } = parsed;

  let eventId: number;
  try {
    eventId = await prisma.$transaction(async (tx) => {
      // Event と子テーブルは入れ子の create でまとめる
      const created = await tx.event.create({
        data: {
          type: data.type,
          date: data.date,
          seasonId: data.seasonId,
          status: "scheduled",
          ...(data.type === "game"
            ? { game: { create: { gameType: data.gameType } } }
            : { practice: { create: {} } }),
        },
        select: { id: true },
      });
      // 試合番号は入力させず、同日の試合を日時順に振り直して決める
      if (data.type === "game") await renumberGamesOfDay(tx, data.date);
      return created.id;
    });
  } catch (error) {
    return toFailureState(error, formData);
  }

  revalidateAll();
  // 続けて詳細（結果・オーダーなど）を入力できるよう、編集画面へ移動する
  redirect(`/admin/events/${eventId}`);
};

const NOT_FOUND: ActionState = { message: "データが見つかりません" };

const eventHubPath = (id: number) => `/admin/events/${id}` as const;

/** いつ・どこで（日時・シーズン・グラウンド・備考）を更新する。試合・練習で共通 */
export const updateEventSchedule = async (
  id: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  await requireAccess("events");
  const parsed = parseForm(eventScheduleSchema, formData);
  if (!parsed.success) return parsed.state;
  const { date, seasonId, groundId, note } = parsed.data;

  try {
    const current = await prisma.event.findUnique({
      where: { id },
      select: { type: true, date: true },
    });
    if (!current) return NOT_FOUND;

    await prisma.$transaction(async (tx) => {
      await tx.event.update({
        where: { id },
        data: {
          date,
          seasonId,
          note,
          ...(current.type === "game"
            ? { game: { update: { groundId } } }
            : { practice: { update: { groundId } } }),
        },
      });

      if (current.type === "game") {
        // 日時を変えると同日の順序が変わるため、変更後の日の試合番号を振り直す。
        // 別の日へ移した場合は、元の日も振り直す（番号の穴を詰める）。
        await renumberGamesOfDay(tx, date);
        if (!isSameJstDay(current.date, date)) {
          await renumberGamesOfDay(tx, current.date);
        }
      }
    });
  } catch (error) {
    return toFailureState(error, formData);
  }

  revalidateAll();
  redirect(eventHubPath(id));
};

/** 対戦（対戦相手・リーグ・試合種別・先攻後攻）を更新する。試合のみ */
export const updateEventMatchup = async (
  id: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  await requireAccess("events");
  const parsed = parseForm(eventMatchupSchema, formData);
  if (!parsed.success) return parsed.state;

  try {
    const { count } = await prisma.game.updateMany({
      where: { eventId: id },
      data: parsed.data,
    });
    if (count === 0) return NOT_FOUND;
  } catch (error) {
    return toFailureState(error, formData);
  }

  revalidateAll();
  redirect(eventHubPath(id));
};

/** 試合の振り返り（天候・戦評・動画・AI 講評・MVP とそのコメント）を更新する。試合のみ */
export const updateEventReview = async (
  id: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  await requireAccess("events");
  const parsed = parseForm(eventReviewSchema, formData);
  if (!parsed.success) return parsed.state;
  const { weather, temperature, ...game } = parsed.data;
  const mvps = parseMvps(formData);
  if (!mvps.success) return toFieldErrorState(formData, mvps.fieldErrors);

  try {
    const current = await prisma.game.findUnique({
      where: { eventId: id },
      select: { id: true },
    });
    if (!current) return NOT_FOUND;

    // MVP は、その試合の参加メンバーの中から選ぶ
    const mvpMemberIds = mvps.entries.map((e) => e.memberId);
    const participants = await prisma.gameParticipant.count({
      where: { gameId: current.id, memberId: { in: mvpMemberIds } },
    });
    if (participants !== mvpMemberIds.length) {
      return toFieldErrorState(formData, {
        [MVPS_ERROR_KEY]: "参加メンバーの中から選択してください",
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.game.update({ where: { id: current.id }, data: game });

      // 表示順の重複（gameId, order）を避けるため、入れ替えずに作り直す
      await tx.gameMvp.deleteMany({ where: { gameId: current.id } });
      await tx.gameMvp.createMany({
        data: mvps.entries.map((e) => ({ ...e, gameId: current.id })),
      });

      if (weather) {
        await tx.gameWeather.upsert({
          where: { gameId: current.id },
          create: { gameId: current.id, weather, temperature },
          update: { weather, temperature },
        });
      } else {
        await tx.gameWeather.deleteMany({ where: { gameId: current.id } });
      }
    });
  } catch (error) {
    return toFailureState(error, formData);
  }

  revalidateAll();
  redirect(eventHubPath(id));
};

/**
 * イベントの子データ（イニング・オーダー・成績など）も Cascade で削除される。
 * 試合を消すと同日の試合番号に穴が空くため、残りの試合の番号を振り直す。
 */
export const deleteEvent = async (id: number): Promise<ActionState> => {
  await requireAccess("events");

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      select: { type: true, date: true },
    });
    if (!event) return { message: "データが見つかりません" };

    await prisma.$transaction(async (tx) => {
      await tx.event.delete({ where: { id } });
      if (event.type === "game") await renumberGamesOfDay(tx, event.date);
    });
  } catch (error) {
    return toDeleteFailureState(error);
  }

  revalidateAll();
  redirect(EVENTS_PATH);
};

/** ハブで、状態（開催予定・開催済み・中止）をすぐに更新する */
export const updateEventStatus = async (
  id: number,
  status: string,
): Promise<ActionState> => {
  await requireAccess("events");
  const parsed = z.enum(EventStatus).safeParse(status);
  if (!parsed.success) return { message: "状態を選択してください" };

  try {
    await prisma.event.update({
      where: { id },
      data: { status: parsed.data },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { message: "データが見つかりません" };
    }
    throw error;
  }

  revalidateAll();
  return {};
};
