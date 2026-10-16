const DEV_ORIGIN = "http://localhost:3000";

type WebAuthnConfig = {
  rpID: string;
  rpName: string;
  origin: string;
};

/**
 * パスキーはドメイン（RP ID）に紐づくため、本番では環境変数の明示を必須にする。
 * RP ID を変えると登録済みのパスキーがすべて使えなくなる。
 * サブドメインを変える可能性があるなら、RP ID には親ドメインを指定する。
 */
export const getWebAuthnConfig = (): WebAuthnConfig => {
  const origin = process.env.WEBAUTHN_ORIGIN;
  const rpID = process.env.WEBAUTHN_RP_ID;

  if (process.env.NODE_ENV === "production" && (!origin || !rpID)) {
    throw new Error("WEBAUTHN_ORIGIN と WEBAUTHN_RP_ID の設定が必要です");
  }

  // .env に `KEY=` と空で書かれた場合も未設定として扱う
  const resolvedOrigin = origin || DEV_ORIGIN;
  return {
    origin: resolvedOrigin,
    rpID: rpID || new URL(resolvedOrigin).hostname,
    rpName: process.env.WEBAUTHN_RP_NAME || "Albatross",
  };
};
