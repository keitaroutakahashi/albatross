import { redirect } from "next/navigation";
import { cache } from "react";
import { isDevAuthBypass } from "@/lib/auth/dev-bypass";
import { getDevUser } from "@/lib/auth/dev-user";
import { getSessionUser } from "@/lib/auth/session";
import { getSessionCookie } from "@/lib/auth/session-cookie";

/** ログイン中のユーザー。同一リクエスト内では 1 回だけ DB を引く */
export const getCurrentUser = cache(async () => {
  if (isDevAuthBypass()) return getDevUser();

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
