export type AuthErrorCode =
  | "invalid_invitation"
  | "invalid_challenge"
  | "verification_failed"
  | "unknown_credential"
  | "not_allowed";

/** 認証まわりの失敗。画面には詳細を出さず、code に応じた汎用メッセージを返すこと */
export class AuthError extends Error {
  constructor(readonly code: AuthErrorCode) {
    super(code);
    this.name = "AuthError";
  }
}
