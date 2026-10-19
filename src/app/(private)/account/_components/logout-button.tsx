"use client";

import { LogOut } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/app/_components/shadcn/button";
import { useNavigationProgressWhile } from "@/app/_components/ui/navigation-progress/use-navigation-progress-while";
import { Spinner } from "@/app/_components/ui/spinner";

/** ログアウトの送信ボタン。form の action（Server Action）が終わってログイン画面へ移るまでの間、処理中を示す */
export const LogoutButton = () => {
  const { pending } = useFormStatus();
  useNavigationProgressWhile(pending);

  return (
    <Button
      type="submit"
      variant="outline"
      size="lg"
      className="w-full"
      disabled={pending}
    >
      {pending ? <Spinner /> : <LogOut />}
      {pending ? "ログアウト中…" : "ログアウト"}
    </Button>
  );
};
