import { notFound } from "next/navigation";

/**
 * 管理者であることを検証する。
 * Server Action は直接呼び出せる公開エンドポイントのため、layout だけでなく
 * すべての Action・データ取得関数の先頭で呼ぶこと。
 *
 * TODO: 認証導入時にセッション検証へ置き換える。
 * それまでは誰でも削除できてしまうため、本番では存在しないページとして扱う。
 */
export const requireAdmin = async (): Promise<void> => {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
};
