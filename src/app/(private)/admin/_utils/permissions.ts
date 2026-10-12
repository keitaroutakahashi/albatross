import type { UserRole } from "@/generated/prisma/enums";

/** 管理画面の機能。ロールごとに使える機能を決める単位 */
export type AdminFeature = "events" | "members" | "options" | "users";

const ROLE_FEATURES: Record<UserRole, readonly AdminFeature[]> = {
  admin: ["events", "members", "options", "users"],
  // 運営は試合・練習の登録など、イベント関連の機能のみ
  operator: ["events"],
};

export const canAccess = (role: UserRole, feature: AdminFeature): boolean =>
  ROLE_FEATURES[role].includes(feature);
