"use client";

import { browserSupportsWebAuthn } from "@simplewebauthn/browser";
import { useState } from "react";

type Result = { ok: true } | { ok: false; message: string };

/** ブラウザ（端末）側の失敗を、利用者向けの文言にする */
const toBrowserMessage = (error: unknown): string => {
  const name = error instanceof Error ? error.name : "";
  // 利用者が認証ダイアログを閉じた場合も NotAllowedError になる
  if (name === "NotAllowedError" || name === "AbortError") {
    return "認証がキャンセルされたか、時間切れになりました。もう一度お試しください";
  }
  if (name === "InvalidStateError") {
    return "この端末のパスキーはすでに登録されています";
  }
  return "パスキーの操作に失敗しました。時間をおいて再度お試しください";
};

/** パスキーの操作（端末の認証ダイアログを挟む一連の処理）の実行中・エラー状態を扱う */
export const usePasskeyCeremony = () => {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  /** 成功したら true。失敗の理由は error に入る */
  const run = async (task: () => Promise<Result>): Promise<boolean> => {
    setPending(true);
    setError(undefined);
    try {
      if (!browserSupportsWebAuthn()) {
        setError(
          "このブラウザはパスキーに対応していません。Safari または Chrome で開いてください",
        );
        return false;
      }
      const result = await task();
      if (!result.ok) {
        setError(result.message);
        return false;
      }
      return true;
    } catch (e) {
      setError(toBrowserMessage(e));
      return false;
    } finally {
      setPending(false);
    }
  };

  return { pending, error, run };
};
