"use server";

import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { AuthError, type AuthErrorCode } from "@/lib/auth/errors";
import { createSession, deleteSession } from "@/lib/auth/session";
import {
  clearSessionCookie,
  getSessionCookie,
  setSessionCookie,
} from "@/lib/auth/session-cookie";
import {
  finishAuthentication,
  finishRegistrationByInvitation,
  finishRegistrationForUser,
  startAuthentication,
  startRegistrationByInvitation,
  startRegistrationForUser,
} from "@/lib/auth/webauthn";
import prisma from "@/lib/prisma";

type Failure = { ok: false; message: string };
type Done = { ok: true };

const MESSAGES: Record<AuthErrorCode, string> = {
  invalid_invitation:
    "招待リンクが無効か、有効期限が切れています。管理者に再発行を依頼してください",
  invalid_challenge: "認証の有効期限が切れました。もう一度お試しください",
  verification_failed: "パスキーを確認できませんでした。もう一度お試しください",
  unknown_credential: "このパスキーは登録されていません",
  not_allowed: "このアカウントではログインできません",
};

/** 失敗の詳細は画面に出さない（攻撃者への手掛かりになるため）。想定外のものはログにだけ残す */
const toFailure = (error: unknown): Failure => {
  if (error instanceof AuthError) {
    return { ok: false, message: MESSAGES[error.code] };
  }
  console.error(error);
  return {
    ok: false,
    message: "予期しないエラーが発生しました。時間をおいて再度お試しください",
  };
};

const NOT_LOGGED_IN: Failure = {
  ok: false,
  message: "ログインしてください",
};

const toPasskeyName = (name: string | undefined): string | null => {
  const trimmed = name?.trim().slice(0, 50);
  return trimmed ? trimmed : null;
};

const loginAs = async (userId: number) => {
  const { token, expiresAt } = await createSession(userId);
  await setSessionCookie(token, expiresAt);
};

export const beginLogin = async (): Promise<
  | {
      ok: true;
      options: PublicKeyCredentialRequestOptionsJSON;
      challengeId: string;
    }
  | Failure
> => {
  try {
    return { ok: true, ...(await startAuthentication()) };
  } catch (error) {
    return toFailure(error);
  }
};

export const completeLogin = async (
  challengeId: string,
  response: AuthenticationResponseJSON,
): Promise<Done | Failure> => {
  try {
    await loginAs(await finishAuthentication({ challengeId, response }));
    return { ok: true };
  } catch (error) {
    return toFailure(error);
  }
};

export const beginInvitationRegistration = async (
  token: string,
): Promise<
  | {
      ok: true;
      options: PublicKeyCredentialCreationOptionsJSON;
      challengeId: string;
    }
  | Failure
> => {
  try {
    return { ok: true, ...(await startRegistrationByInvitation(token)) };
  } catch (error) {
    return toFailure(error);
  }
};

export const completeInvitationRegistration = async (params: {
  token: string;
  challengeId: string;
  response: RegistrationResponseJSON;
  name?: string;
}): Promise<Done | Failure> => {
  try {
    const userId = await finishRegistrationByInvitation({
      ...params,
      name: toPasskeyName(params.name),
    });
    await loginAs(userId);
    return { ok: true };
  } catch (error) {
    return toFailure(error);
  }
};

export const beginAddPasskey = async (): Promise<
  | {
      ok: true;
      options: PublicKeyCredentialCreationOptionsJSON;
      challengeId: string;
    }
  | Failure
> => {
  const user = await getCurrentUser();
  if (!user) return NOT_LOGGED_IN;
  try {
    return { ok: true, ...(await startRegistrationForUser(user)) };
  } catch (error) {
    return toFailure(error);
  }
};

export const completeAddPasskey = async (params: {
  challengeId: string;
  response: RegistrationResponseJSON;
  name?: string;
}): Promise<Done | Failure> => {
  const user = await getCurrentUser();
  if (!user) return NOT_LOGGED_IN;
  try {
    await finishRegistrationForUser({
      ...params,
      userId: user.id,
      name: toPasskeyName(params.name),
    });
    revalidatePath("/account");
    return { ok: true };
  } catch (error) {
    return toFailure(error);
  }
};

/** 自分のパスキーを削除する。最後の 1 つを消すとログインできなくなるため不可 */
export const deletePasskey = async (id: string): Promise<Done | Failure> => {
  const user = await getCurrentUser();
  if (!user) return NOT_LOGGED_IN;

  const count = await prisma.passkey.count({ where: { userId: user.id } });
  if (count <= 1) {
    return {
      ok: false,
      message:
        "最後のパスキーは削除できません。先に別のパスキーを追加してください",
    };
  }

  await prisma.passkey.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/account");
  return { ok: true };
};

export const logout = async () => {
  const token = await getSessionCookie();
  if (token) await deleteSession(token);
  await clearSessionCookie();
  redirect("/login");
};
