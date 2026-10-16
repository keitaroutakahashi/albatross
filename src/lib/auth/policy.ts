import { canEnterAdmin } from "@/app/(private)/admin/_utils/permissions";
import type { UserRole } from "@/generated/prisma/enums";

/**
 * ログインを許可するロールか。
 * 現状は管理画面に入れるロール（管理者・運営）のみ。一般ユーザーのログインを
 * 提供するときは、ここだけ変えればよい。
 */
export const canSignIn = (role: UserRole): boolean => canEnterAdmin(role);
