import { AuthError } from "@/lib/auth/errors";
import { canSignIn } from "@/lib/auth/policy";
import { generateToken, hashToken } from "@/lib/auth/token";
import prisma from "@/lib/prisma";

const DAY_MS = 24 * 60 * 60 * 1000;

export const INVITATION_TTL_MS = 3 * DAY_MS;

/**
 * パスキー登録用の招待を発行する。再発行すると未使用の招待は無効になる。
 * 端末の紛失に備え、そのユーザーの既存セッションもすべて失効させる。
 */
export const issueInvitation = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (!user || !canSignIn(user.role)) throw new AuthError("not_allowed");

  const token = generateToken();
  const expiresAt = new Date(Date.now() + INVITATION_TTL_MS);
  await prisma.$transaction([
    prisma.invitation.deleteMany({ where: { userId, usedAt: null } }),
    prisma.session.deleteMany({ where: { userId } }),
    prisma.invitation.create({
      data: { tokenHash: hashToken(token), userId, expiresAt },
    }),
  ]);
  return { token, expiresAt };
};

/** 未使用・期限内・ログイン可能なロールの招待だけを返す */
export const findValidInvitation = async (token: string) => {
  const invitation = await prisma.invitation.findUnique({
    where: { tokenHash: hashToken(token) },
    include: {
      user: { select: { id: true, email: true, name: true, role: true } },
    },
  });
  if (
    !invitation ||
    invitation.usedAt ||
    invitation.expiresAt <= new Date() ||
    !canSignIn(invitation.user.role)
  ) {
    return null;
  }
  return invitation;
};
