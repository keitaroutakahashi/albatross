import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginButton } from "@/app/_features/auth/components/login-button";
import { getCurrentUser } from "@/lib/auth/current-user";

export const metadata: Metadata = {
  title: "ログイン",
};

export default async function Page() {
  if (await getCurrentUser()) redirect("/admin");

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-center text-lg font-bold">ログイン</h1>
      <p className="text-center text-sm text-muted-foreground">
        管理者・運営の方は、登録したパスキーでログインできます。
      </p>
      <LoginButton />
      <p className="text-center text-xs text-muted-foreground">
        パスキーを登録していない場合や、端末を変更した場合は、管理者に招待リンクの発行を依頼してください。
      </p>
    </section>
  );
}
