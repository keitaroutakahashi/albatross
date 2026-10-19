import { SESSION_USER_SELECT } from "@/lib/auth/session";
import prisma from "@/lib/prisma";

const DEV_USER_EMAIL = "dev@localhost";

/**
 * 認証を省くときにログイン中として扱うユーザー。最初の管理者を使う。
 * 管理者がまだいなければ、開発用の管理者を作る（アカウント画面などがユーザーの行を参照するため、実在の行にする）。
 */
export const getDevUser = async () => {
  const admin = await prisma.user.findFirst({
    where: { role: "admin" },
    orderBy: { id: "asc" },
    select: SESSION_USER_SELECT,
  });
  if (admin) return admin;

  return prisma.user.upsert({
    where: { email: DEV_USER_EMAIL },
    update: {},
    create: { email: DEV_USER_EMAIL, name: "開発用管理者", role: "admin" },
    select: SESSION_USER_SELECT,
  });
};
