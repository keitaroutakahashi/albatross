"use client";

import { startAuthentication } from "@simplewebauthn/browser";
import { Fingerprint } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { beginLogin, completeLogin } from "@/app/_actions/auth";
import { Button } from "@/app/_components/shadcn/button";
import { useNavigationProgressWhile } from "@/app/_components/ui/navigation-progress/use-navigation-progress-while";
import { usePasskeyCeremony } from "@/app/_features/auth/hooks/use-passkey-ceremony";

export const LoginButton = () => {
  const router = useRouter();
  const { pending, error, run } = usePasskeyCeremony();
  // ログイン後に管理画面へ切り替わるまでの待ち時間
  const [navigating, startNavigation] = useTransition();
  useNavigationProgressWhile(navigating);

  const handleClick = async () => {
    const ok = await run(async () => {
      const begin = await beginLogin();
      if (!begin.ok) return begin;
      const response = await startAuthentication({
        optionsJSON: begin.options,
      });
      return completeLogin(begin.challengeId, response);
    });
    if (ok) startNavigation(() => router.replace("/admin"));
  };

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <p
          role="alert"
          className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      )}
      <Button
        size="lg"
        className="h-11"
        disabled={pending || navigating}
        onClick={handleClick}
      >
        <Fingerprint />
        {pending ? "確認中…" : "パスキーでログイン"}
      </Button>
    </div>
  );
};
