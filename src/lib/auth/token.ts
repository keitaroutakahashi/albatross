import { createHash, randomBytes } from "node:crypto";

/** 推測できないランダムなトークンを作る（セッション・招待リンク用） */
export const generateToken = (): string =>
  randomBytes(32).toString("base64url");

/** DB にはトークンそのものではなくハッシュを保存する。漏えいしても悪用できないようにするため */
export const hashToken = (token: string): string =>
  createHash("sha256").update(token).digest("hex");
