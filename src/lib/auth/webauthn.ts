import {
  type AuthenticationResponseJSON,
  type AuthenticatorTransport,
  generateAuthenticationOptions,
  generateRegistrationOptions,
  type RegistrationResponseJSON,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { consumeChallenge, createChallenge } from "@/lib/auth/challenge";
import { getWebAuthnConfig } from "@/lib/auth/config";
import { AuthError } from "@/lib/auth/errors";
import { findValidInvitation } from "@/lib/auth/invitation";
import { canSignIn } from "@/lib/auth/policy";
import prisma from "@/lib/prisma";

type RegistrationUser = { id: number; email: string; name: string | null };

/**
 * 管理画面へのアクセスを守るため、生体認証・PIN による本人確認（UV）を必須にする。
 * residentKey を必須にして、ユーザー名の入力なしでログインできるようにする。
 */
const startRegistration = async (user: RegistrationUser) => {
  const { rpID, rpName } = getWebAuthnConfig();
  const existing = await prisma.passkey.findMany({
    where: { userId: user.id },
    select: { id: true, transports: true },
  });

  const options = await generateRegistrationOptions({
    rpID,
    rpName,
    userName: user.email,
    userDisplayName: user.name ?? user.email,
    userID: new TextEncoder().encode(String(user.id)),
    attestationType: "none",
    excludeCredentials: existing.map((p) => ({
      id: p.id,
      transports: p.transports as AuthenticatorTransport[],
    })),
    authenticatorSelection: {
      residentKey: "required",
      userVerification: "required",
    },
  });
  const challengeId = await createChallenge({
    challenge: options.challenge,
    purpose: "registration",
    userId: user.id,
  });
  return { options, challengeId };
};

const verifyRegistration = async (
  challengeId: string,
  userId: number,
  response: RegistrationResponseJSON,
) => {
  const challenge = await consumeChallenge(challengeId, "registration");
  if (!challenge || challenge.userId !== userId) {
    throw new AuthError("invalid_challenge");
  }

  const { rpID, origin } = getWebAuthnConfig();
  try {
    const { verified, registrationInfo } = await verifyRegistrationResponse({
      response,
      expectedChallenge: challenge.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: true,
    });
    if (!verified || !registrationInfo) throw new Error("not verified");
    return registrationInfo;
  } catch {
    throw new AuthError("verification_failed");
  }
};

const toPasskeyData = (
  userId: number,
  info: Awaited<ReturnType<typeof verifyRegistration>>,
  name: string | null,
) => ({
  id: info.credential.id,
  userId,
  publicKey: new Uint8Array(info.credential.publicKey),
  counter: info.credential.counter,
  transports: info.credential.transports ?? [],
  backedUp: info.credentialBackedUp,
  name,
});

/** 招待リンクからの初回登録・再登録を始める */
export const startRegistrationByInvitation = async (token: string) => {
  const invitation = await findValidInvitation(token);
  if (!invitation) throw new AuthError("invalid_invitation");
  return startRegistration(invitation.user);
};

/** 招待を消費してパスキーを登録し、ログインさせるユーザー ID を返す */
export const finishRegistrationByInvitation = async (params: {
  token: string;
  challengeId: string;
  response: RegistrationResponseJSON;
  name?: string | null;
}) => {
  const invitation = await findValidInvitation(params.token);
  if (!invitation) throw new AuthError("invalid_invitation");

  const info = await verifyRegistration(
    params.challengeId,
    invitation.userId,
    params.response,
  );

  await prisma.$transaction(async (tx) => {
    // 同じ招待での二重登録を防ぐため、未使用のものを更新できた場合だけ進める
    const { count } = await tx.invitation.updateMany({
      where: { id: invitation.id, usedAt: null, expiresAt: { gt: new Date() } },
      data: { usedAt: new Date() },
    });
    if (count === 0) throw new AuthError("invalid_invitation");

    await tx.passkey.create({
      data: toPasskeyData(invitation.userId, info, params.name ?? null),
    });
  });
  return invitation.userId;
};

/** ログイン済みユーザーが、パスキーを追加するための登録を始める */
export const startRegistrationForUser = async (user: RegistrationUser) =>
  startRegistration(user);

export const finishRegistrationForUser = async (params: {
  userId: number;
  challengeId: string;
  response: RegistrationResponseJSON;
  name?: string | null;
}) => {
  const info = await verifyRegistration(
    params.challengeId,
    params.userId,
    params.response,
  );
  await prisma.passkey.create({
    data: toPasskeyData(params.userId, info, params.name ?? null),
  });
};

/** ユーザー名なしのログインを始める（保存済みのパスキーから端末側で選ばせる） */
export const startAuthentication = async () => {
  const { rpID } = getWebAuthnConfig();
  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: "required",
  });
  const challengeId = await createChallenge({
    challenge: options.challenge,
    purpose: "authentication",
  });
  return { options, challengeId };
};

/** パスキーを検証し、ログインさせるユーザー ID を返す */
export const finishAuthentication = async (params: {
  challengeId: string;
  response: AuthenticationResponseJSON;
}) => {
  const challenge = await consumeChallenge(
    params.challengeId,
    "authentication",
  );
  if (!challenge) throw new AuthError("invalid_challenge");

  const passkey = await prisma.passkey.findUnique({
    where: { id: params.response.id },
    include: { user: { select: { id: true, role: true } } },
  });
  if (!passkey) throw new AuthError("unknown_credential");

  const { rpID, origin } = getWebAuthnConfig();
  let newCounter: number;
  try {
    const { verified, authenticationInfo } = await verifyAuthenticationResponse(
      {
        response: params.response,
        expectedChallenge: challenge.challenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        requireUserVerification: true,
        credential: {
          id: passkey.id,
          publicKey: passkey.publicKey,
          counter: passkey.counter,
          transports: passkey.transports as AuthenticatorTransport[],
        },
      },
    );
    if (!verified) throw new Error("not verified");
    newCounter = authenticationInfo.newCounter;
  } catch {
    throw new AuthError("verification_failed");
  }

  if (!canSignIn(passkey.user.role)) throw new AuthError("not_allowed");

  await prisma.passkey.update({
    where: { id: passkey.id },
    data: { counter: newCounter, lastUsedAt: new Date() },
  });
  return passkey.user.id;
};
