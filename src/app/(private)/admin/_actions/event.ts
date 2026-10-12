"use server";

import { redirect } from "next/navigation";
import { getJstDayRange } from "@/app/_utils/date/date";
import {
  eventBasicSchema,
  eventCreateSchema,
  eventResultSchema,
} from "@/app/(private)/admin/_schemas/event";
import {
  parseForm,
  revalidateAll,
  toDeleteFailureState,
  toFailureState,
  toFieldErrorState,
} from "@/app/(private)/admin/_utils/action";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import { requireAccess } from "@/app/(private)/admin/_utils/auth";
import prisma from "@/lib/prisma";

const EVENTS_PATH = "/admin/events";

/** 同日の試合番号の重複は DB 制約ではなく、ここで検証する */
const validateGameNumber = async (
  data: { date: Date; gameNumber: number },
  excludeEventId?: number,
): Promise<string | null> => {
  const { start, end } = getJstDayRange(data.date);
  const duplicated = await prisma.game.findFirst({
    where: {
      gameNumber: data.gameNumber,
      event: {
        date: { gte: start, lt: end },
        id: excludeEventId === undefined ? undefined : { not: excludeEventId },
      },
    },
    select: { id: true },
  });
  return duplicated ? "同日に同じ試合番号の試合があります" : null;
};

export const createEvent = async (
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  await requireAccess("events");
  const parsed = parseForm(eventCreateSchema, formData);
  if (!parsed.success) return parsed.state;
  const { data } = parsed;

  if (data.type === "game") {
    const error = await validateGameNumber(data);
    if (error) return toFieldErrorState(formData, { gameNumber: error });
  }

  let eventId: number;
  try {
    // Event と子テーブルは入れ子の create で 1 トランザクションにまとめる
    const created = await prisma.event.create({
      data: {
        type: data.type,
        date: data.date,
        seasonId: data.seasonId,
        status: "scheduled",
        ...(data.type === "game"
          ? {
              game: {
                create: {
                  gameNumber: data.gameNumber,
                  gameType: data.gameType,
                },
              },
            }
          : { practice: { create: {} } }),
      },
      select: { id: true },
    });
    eventId = created.id;
  } catch (error) {
    return toFailureState(error, formData);
  }

  revalidateAll();
  // 続けて詳細（結果・出場した選手など）を入力できるよう、編集画面へ移動する
  redirect(`/admin/events/${eventId}`);
};

/** 基本情報（日時・状態など、試合は天候・戦評・動画・AI 講評も含む）を更新する */
export const updateEventBasic = async (
  id: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  await requireAccess("events");
  const parsed = parseForm(eventBasicSchema, formData);
  if (!parsed.success) return parsed.state;
  const { data } = parsed;

  try {
    const current = await prisma.event.findUnique({
      where: { id },
      select: { type: true, game: { select: { id: true } } },
    });
    if (!current) return { message: "データが見つかりません" };
    // 種別を変えると子テーブルが入れ替わるため、編集では変更させない
    if (current.type !== data.type) {
      return { message: "イベントの種別は変更できません" };
    }

    if (data.type === "game") {
      const error = await validateGameNumber(data, id);
      if (error) return toFieldErrorState(formData, { gameNumber: error });
    }

    await prisma.$transaction(async (tx) => {
      await tx.event.update({
        where: { id },
        data: {
          date: data.date,
          status: data.status,
          seasonId: data.seasonId,
          note: data.note,
          ...(data.type === "game"
            ? {
                game: {
                  update: {
                    gameNumber: data.gameNumber,
                    gameType: data.gameType,
                    isFirstBatting: data.isFirstBatting,
                    leagueId: data.leagueId,
                    groundId: data.groundId,
                    opponentId: data.opponentId,
                    summary: data.summary,
                    videoUrl: data.videoUrl,
                    aiGoodPoints: data.aiGoodPoints,
                    aiBadPoints: data.aiBadPoints,
                  },
                },
              }
            : { practice: { update: { groundId: data.groundId } } }),
        },
      });

      if (data.type === "game" && current.game) {
        const gameId = current.game.id;
        if (data.weather) {
          await tx.gameWeather.upsert({
            where: { gameId },
            create: {
              gameId,
              weather: data.weather,
              temperature: data.temperature,
            },
            update: { weather: data.weather, temperature: data.temperature },
          });
        } else {
          await tx.gameWeather.deleteMany({ where: { gameId } });
        }
      }
    });
  } catch (error) {
    return toFailureState(error, formData);
  }

  revalidateAll();
  redirect(`/admin/events/${id}`);
};

/** 試合結果の手入力項目（安打・失策）を更新する */
export const updateEventResult = async (
  id: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  await requireAccess("events");
  const parsed = parseForm(eventResultSchema, formData);
  if (!parsed.success) return parsed.state;

  try {
    const game = await prisma.game.findUnique({
      where: { eventId: id },
      select: { id: true },
    });
    if (!game) return { message: "データが見つかりません" };

    await prisma.game.update({
      where: { id: game.id },
      data: parsed.data,
    });
  } catch (error) {
    return toFailureState(error, formData);
  }

  revalidateAll();
  redirect(EVENTS_PATH);
};

/** イベントの子データ（イニング・出場した選手・成績など）も Cascade で削除される */
export const deleteEvent = async (id: number): Promise<ActionState> => {
  await requireAccess("events");

  try {
    await prisma.event.delete({ where: { id } });
  } catch (error) {
    return toDeleteFailureState(error);
  }

  revalidateAll();
  redirect(EVENTS_PATH);
};
