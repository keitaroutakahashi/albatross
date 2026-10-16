import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/lib/auth/cookie-name";

export const setSessionCookie = async (token: string, expiresAt: Date) => {
  (await cookies()).set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
};

export const getSessionCookie = async (): Promise<string | undefined> =>
  (await cookies()).get(SESSION_COOKIE_NAME)?.value;

export const clearSessionCookie = async () => {
  (await cookies()).delete(SESSION_COOKIE_NAME);
};
