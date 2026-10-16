import { canSignIn } from "@/lib/auth/policy";
import { generateToken, hashToken } from "@/lib/auth/token";
import prisma from "@/lib/prisma";

const DAY_MS = 24 * 60 * 60 * 1000;

/** 期間は固定（延長しない）。期限が来てもパスキーで再ログインするだけなので負担が小さい */
export const SESSION_TTL_MS = 30 * DAY_MS;

export const createSession = async (userId: number) => {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await prisma.session.create({
    data: { id: hashToken(token), userId, expiresAt },
  });
  return { token, expiresAt };
};

/** 有効なセッションのユーザーを返す。期限切れ・ログイン不可のロールに変わっている場合は破棄して null */
export const getSessionUser = async (token: string) => {
  const id = hashToken(token);
  const session = await prisma.session.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, email: true, name: true, role: true } },
    },
  });
  if (!session) return null;

  if (session.expiresAt <= new Date() || !canSignIn(session.user.role)) {
    await prisma.session.deleteMany({ where: { id } });
    return null;
  }
  return session.user;
};

export const deleteSession = async (token: string) => {
  await prisma.session.deleteMany({ where: { id: hashToken(token) } });
};
