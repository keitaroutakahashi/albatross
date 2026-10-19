/**
 * ts-league の試合結果ページを取得して HTML を保存する。
 * 取得先は環境変数 TS_LEAGUE_ORIGIN（例: https://example.com）と同じ origin の URL だけに限る。
 * ドメインをコードに書かず、別のホストへのアクセスや、リダイレクトでの遷移を防ぐ。
 *
 *   # .env.local に TS_LEAGUE_ORIGIN を設定しておく
 *   pnpm game:fetch '<試合結果ページの URL>' game.html
 */
import { writeFileSync } from "node:fs";
import { config } from "dotenv";

config({ path: ".env.local" });

const MAX_BYTES = 5 * 1024 * 1024;

const [url, outPath] = process.argv.slice(2);
if (!url || !outPath) {
  console.error("使い方: pnpm game:fetch <URL> <out.html>");
  process.exit(1);
}

const origin = process.env.TS_LEAGUE_ORIGIN;
if (!origin) {
  console.error(
    "環境変数 TS_LEAGUE_ORIGIN が未設定です（.env.local に設定してください）",
  );
  process.exit(1);
}

const target = new URL(url);
if (target.origin !== new URL(origin).origin) {
  console.error(
    `許可していない取得先です: ${target.origin}（TS_LEAGUE_ORIGIN と一致する URL のみ）`,
  );
  process.exit(1);
}

// リダイレクトは辿らない（許可した origin の外へ出ないようにする）
const response = await fetch(target, { redirect: "error" });
if (!response.ok) {
  console.error(`取得に失敗しました: HTTP ${response.status}`);
  process.exit(1);
}

const html = await response.text();
if (Buffer.byteLength(html) > MAX_BYTES) {
  console.error("HTML が大きすぎます");
  process.exit(1);
}

writeFileSync(outPath, html);
console.log(`${Buffer.byteLength(html)} bytes -> ${outPath}`);
