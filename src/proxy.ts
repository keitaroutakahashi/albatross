import { type NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/cookie-name";

/**
 * セッション Cookie の有無だけを見て、未ログインの人をログイン画面へ送る。
 * Cookie の中身が有効かどうかは DB を引かないと分からないため、ここでは判定しない。
 * 権限の確認は、各ページ・Server Action・データ取得関数で必ず行うこと。
 */
export function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE_NAME)) return NextResponse.next();
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
