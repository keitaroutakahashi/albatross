import { notFound } from "next/navigation";
import {
  type AdminFeature,
  canAccess,
} from "@/app/(private)/admin/_utils/permissions";
import { UserRole } from "@/generated/prisma/enums";

/**
 * ログイン中のユーザーのロールを返す。
 * Server Action は直接呼び出せる公開エンドポイントのため、layout だけでなく
 * すべての Action・データ取得関数で権限を確認すること。
 *
 * TODO: 認証導入時にセッションから取得する実装へ置き換える。
 * それまでは誰でも操作できてしまうため、本番では存在しないページとして扱う。
 * 開発中は既定で管理者になる。運営の画面を確認するときは ADMIN_DEV_ROLE=operator を指定する。
 */
export const getCurrentRole = async (): Promise<UserRole> => {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const role = Object.values(UserRole).find(
    (r) => r === process.env.ADMIN_DEV_ROLE,
  );
  return role ?? UserRole.admin;
};

/** 指定した機能を使えるロールか確認する。使えなければ存在しないページとして扱う */
export const requireAccess = async (feature: AdminFeature): Promise<void> => {
  const role = await getCurrentRole();
  if (!canAccess(role, feature)) notFound();
};
