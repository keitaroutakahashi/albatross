/**
 * パスキー登録用の招待リンクを発行する緊急用・初期設定用の CLI。
 * 最初の管理者を作るときや、管理者全員がログインできなくなったときに使う。
 *
 *   pnpm auth:invite taro@example.com
 *   pnpm auth:invite new@example.com --create --role admin
 *   pnpm auth:invite:production taro@example.com
 */
import { parseArgs } from "node:util";
import { config } from "dotenv";

// lib/prisma.ts は読み込み時に DATABASE_URL を参照するため、先に環境変数を読み込む
config({ path: ".env.local" });

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    create: { type: "boolean", default: false },
    role: { type: "string", default: "admin" },
  },
});

const email = positionals[0];
if (!email) {
  console.error("使い方: pnpm auth:invite <email> [--create --role admin]");
  process.exit(1);
}

const { default: prisma } = await import("@/lib/prisma");
const { getWebAuthnConfig } = await import("@/lib/auth/config");
const { AuthError } = await import("@/lib/auth/errors");
const { issueInvitation } = await import("@/lib/auth/invitation");
const { UserRole } = await import("@/generated/prisma/enums");

try {
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    if (!values.create) {
      console.error(
        `ユーザーが見つかりません: ${email}\n新しく作る場合は --create を付けてください`,
      );
      process.exit(1);
    }
    const role = Object.values(UserRole).find((r) => r === values.role);
    if (!role) {
      console.error(`role が不正です: ${values.role}`);
      process.exit(1);
    }
    user = await prisma.user.create({ data: { email, role } });
    console.log(`ユーザーを作成しました: ${email} (${role})`);
  }

  const { token, expiresAt } = await issueInvitation(user.id);
  console.log(`\n${getWebAuthnConfig().origin}/invite/${token}`);
  console.log(`\n有効期限: ${expiresAt.toLocaleString("ja-JP")}`);
  console.log("このユーザーの既存のログインは無効になりました");
} catch (error) {
  if (error instanceof AuthError && error.code === "not_allowed") {
    console.error("このユーザーは一般ユーザーのため、招待できません");
    process.exit(1);
  }
  throw error;
} finally {
  await prisma.$disconnect();
}
