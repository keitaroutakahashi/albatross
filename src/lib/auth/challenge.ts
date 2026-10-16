import type { ChallengePurpose } from "@/generated/prisma/enums";
import { generateToken } from "@/lib/auth/token";
import prisma from "@/lib/prisma";

const CHALLENGE_TTL_MS = 5 * 60 * 1000;

/** チャレンジを保存し、Cookie に載せる ID を返す */
export const createChallenge = async (params: {
  challenge: string;
  purpose: ChallengePurpose;
  userId?: number;
}) => {
  const now = Date.now();
  // 使われずに残ったチャレンジを、書き込みのついでに掃除する
  await prisma.webAuthnChallenge.deleteMany({
    where: { expiresAt: { lt: new Date(now) } },
  });

  const id = generateToken();
  await prisma.webAuthnChallenge.create({
    data: {
      id,
      challenge: params.challenge,
      purpose: params.purpose,
      userId: params.userId,
      expiresAt: new Date(now + CHALLENGE_TTL_MS),
    },
  });
  return id;
};

/** チャレンジを 1 回だけ取り出す。用途の不一致・期限切れ・使用済みは null */
export const consumeChallenge = async (
  id: string,
  purpose: ChallengePurpose,
) => {
  const record = await prisma.webAuthnChallenge.findUnique({ where: { id } });
  if (!record) return null;

  // 並行リクエストで同じチャレンジを二重に使えないよう、削除できた側だけが成功する
  const { count } = await prisma.webAuthnChallenge.deleteMany({
    where: { id },
  });
  if (count === 0) return null;

  if (record.purpose !== purpose || record.expiresAt <= new Date()) return null;
  return record;
};
