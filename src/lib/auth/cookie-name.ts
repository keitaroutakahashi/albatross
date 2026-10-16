/**
 * `__Host-` 付きの Cookie は Secure・Path=/・Domain なしを強制され、サブドメインから上書きされない。
 * Secure が必須なので、http の開発環境では付けない。
 */
export const SESSION_COOKIE_NAME =
  process.env.NODE_ENV === "production" ? "__Host-session" : "session";
