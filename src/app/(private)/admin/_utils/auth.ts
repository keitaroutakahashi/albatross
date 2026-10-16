import { notFound } from "next/navigation";
import {
  type AdminFeature,
  canAccess,
  canEnterAdmin,
} from "@/app/(private)/admin/_utils/permissions";
import type { UserRole } from "@/generated/prisma/enums";
import { requireUser } from "@/lib/auth/current-user";

/**
 * ログイン中のユーザーのロールを返す。未ログインならログイン画面へ送る。
 * Server Action は直接呼び出せる公開エンドポイントのため、layout だけでなく
 * すべての Action・データ取得関数で権限を確認すること。
 */
export const getCurrentRole = async (): Promise<UserRole> =>
  (await requireUser()).role;

/** 管理画面に入れるロールか確認する。入れなければ存在しないページとして扱う */
export const requireAdminEntry = async (): Promise<void> => {
  const role = await getCurrentRole();
  if (!canEnterAdmin(role)) notFound();
};

/** 指定した機能を使えるロールか確認する。使えなければ存在しないページとして扱う */
export const requireAccess = async (feature: AdminFeature): Promise<void> => {
  const role = await getCurrentRole();
  if (!canAccess(role, feature)) notFound();
};
