import type { Metadata } from "next";
import { PasskeyRegisterForm } from "@/app/_features/auth/components/passkey-register-form";
import { findValidInvitation } from "@/lib/auth/invitation";

export const metadata: Metadata = {
  title: "パスキーの登録",
};

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invitation = await findValidInvitation(token);

  if (!invitation) {
    return (
      <section className="flex flex-col gap-3 text-center">
        <h1 className="text-lg font-bold">招待リンクが無効です</h1>
        <p className="text-sm text-muted-foreground">
          リンクの有効期限が切れているか、すでに使用されています。管理者に再発行を依頼してください。
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-center text-lg font-bold">パスキーの登録</h1>
      <p className="text-center text-sm text-muted-foreground">
        {invitation.user.name ?? invitation.user.email}
        さんのパスキーをこの端末に登録します。登録後は、指紋・顔認証・端末の PIN
        でログインできます。
      </p>
      <PasskeyRegisterForm mode="invitation" token={token} />
    </section>
  );
}
