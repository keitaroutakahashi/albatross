"use client";

import { startRegistration } from "@simplewebauthn/browser";
import { Fingerprint } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  beginAddPasskey,
  beginInvitationRegistration,
  completeAddPasskey,
  completeInvitationRegistration,
} from "@/app/_actions/auth";
import { Button } from "@/app/_components/shadcn/button";
import { Input } from "@/app/_components/shadcn/input";
import { Label } from "@/app/_components/shadcn/label";
import { usePasskeyCeremony } from "@/app/_features/auth/hooks/use-passkey-ceremony";

type Props =
  /** 招待リンクからの初回登録・再登録。登録後はそのままログインする */
  | { mode: "invitation"; token: string }
  /** ログイン済みユーザーによるパスキーの追加 */
  | { mode: "add" };

/** 端末名の初期値。覚えやすい名前にするため、UA から大まかな端末種別を推測する */
const guessDeviceName = (): string => {
  const ua = navigator.userAgent;
  if (/iPhone/.test(ua)) return "iPhone";
  if (/iPad/.test(ua)) return "iPad";
  if (/Android/.test(ua)) return "Android";
  if (/Mac/.test(ua)) return "Mac";
  if (/Windows/.test(ua)) return "Windows";
  return "このデバイス";
};

export const PasskeyRegisterForm = (props: Props) => {
  const router = useRouter();
  const { pending, error, run } = usePasskeyCeremony();
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const deviceName = name.trim() || guessDeviceName();

    const ok = await run(async () => {
      if (props.mode === "invitation") {
        const begin = await beginInvitationRegistration(props.token);
        if (!begin.ok) return begin;
        const response = await startRegistration({
          optionsJSON: begin.options,
        });
        return completeInvitationRegistration({
          token: props.token,
          challengeId: begin.challengeId,
          response,
          name: deviceName,
        });
      }

      const begin = await beginAddPasskey();
      if (!begin.ok) return begin;
      const response = await startRegistration({ optionsJSON: begin.options });
      return completeAddPasskey({
        challengeId: begin.challengeId,
        response,
        name: deviceName,
      });
    });
    if (!ok) return;

    if (props.mode === "invitation") router.replace("/admin");
    else setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <p
          role="alert"
          className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      )}
      <div className="flex flex-col gap-2">
        <Label htmlFor="passkey-name">端末の名前（任意）</Label>
        <Input
          id="passkey-name"
          value={name}
          maxLength={50}
          placeholder="例: 私の iPhone"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <Button type="submit" size="lg" className="h-11" disabled={pending}>
        <Fingerprint />
        {pending ? "登録中…" : "パスキーを登録する"}
      </Button>
    </form>
  );
};
