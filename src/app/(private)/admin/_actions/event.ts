"use server";

import { redirect } from "next/navigation";
import { getJstDayRange } from "@/app/_utils/date/date";
import { calcGameResult } from "@/app/_utils/stats/game-result";
import {
  type EventInput,
  eventCreateSchema,
  eventSchema,
  type GameEventInput,
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
import type { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

const EVENTS_PATH = "/admin/events";

const toEventData = (data: EventInput) => ({
  date: data.date,
  status: data.status,
  seasonId: data.seasonId,
  note: data.note,
});

/** Game の保存用データ。勝敗は得点から算出する（入力欄は持たない） */
const toGameData = (data: GameEventInput) => ({
  gameNumber: data.gameNumber,
  gameType: data.gameType,
  isFirstBatting: data.isFirstBatting,
  leagueId: data.leagueId,
  groundId: data.groundId,
  opponentId: data.opponentId,
  teamScore: data.teamScore,
  opponentScore: data.opponentScore,
  teamHits: data.teamHits,
  opponentHits: data.opponentHits,
  teamErrors: data.teamErrors,
  opponentErrors: data.opponentErrors,
  teamForfeitedRuns: data.teamForfeitedRuns,
  opponentForfeitedRuns: data.opponentForfeitedRuns,
  result: calcGameResult(data.teamScore, data.opponentScore),
  summary: data.summary,
  videoUrl: data.videoUrl,
  aiGoodPoints: data.aiGoodPoints,
  aiBadPoints: data.aiBadPoints,
});

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

export const updateEvent = async (
  id: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  await requireAccess("events");
  const parsed = parseForm(eventSchema, formData);
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
      const eventData: Prisma.EventUpdateInput = toEventData(data);
      if (data.type === "game" && current.game) {
        await tx.event.update({
          where: { id },
          data: {
            ...eventData,
            game: { update: toGameData(data) },
          },
        });
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
      } else if (data.type === "practice") {
        await tx.event.update({
          where: { id },
          data: {
            ...eventData,
            practice: { update: { groundId: data.groundId } },
          },
        });
      }
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
