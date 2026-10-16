import { redirect } from "next/navigation";
import { cache } from "react";
import { getSessionUser } from "@/lib/auth/session";
import { getSessionCookie } from "@/lib/auth/session-cookie";

/** ログイン中のユーザー。同一リクエスト内では 1 回だけ DB を引く */
export const getCurrentUser = cache(async () => {
  const token = await getSessionCookie();
  if (!token) return null;
  return getSessionUser(token);
});

/** 未ログインならログイン画面へ送る */
export const requireUser = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
};
