/**
 * 開発用に、パスキーでのログインを省くか。
 * DB を作り直すたびにパスキーを登録し直さずに済むようにするためのもの。
 * `pnpm dev`（NODE_ENV=development）で、かつ .env.local に AUTH_DISABLED_FOR_DEV=true を
 * 書いたときだけ有効にする。本番（Vercel・`pnpm start`）では、環境変数があっても無視して認証を有効のままにする。
 */
export const isDevAuthBypass = (): boolean =>
  process.env.NODE_ENV === "development" &&
  process.env.AUTH_DISABLED_FOR_DEV === "true";
