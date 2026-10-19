import { Cloud, Smartphone } from "lucide-react";
import type { Metadata } from "next";
import { logout } from "@/app/_actions/auth";
import { userRoleLabel } from "@/app/_constants/labels";
import { PasskeyRegisterForm } from "@/app/_features/auth/components/passkey-register-form";
import { LogoutButton } from "@/app/(private)/account/_components/logout-button";
import { PasskeyDeleteButton } from "@/app/(private)/account/_components/passkey-delete-button";
import { requireUser } from "@/lib/auth/current-user";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "アカウント",
};

const dateFormat = new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "medium",
  timeZone: "Asia/Tokyo",
});

export default async function Page() {
  const user = await requireUser();
  const passkeys = await prisma.passkey.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      backedUp: true,
      createdAt: true,
      lastUsedAt: true,
    },
  });

  return (
    <>
      <section className="flex flex-col gap-1">
        <p className="text-base font-bold">{user.name ?? user.email}</p>
        {user.name && (
          <p className="text-sm text-muted-foreground">{user.email}</p>
        )}
        <p className="text-sm text-muted-foreground">
          権限: {userRoleLabel[user.role]}
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-bold">登録済みのパスキー</h2>
        <ul className="flex flex-col divide-y rounded-md border">
          {passkeys.map((p) => {
            const label = p.name ?? "名前なし";
            return (
              <li key={p.id} className="flex items-center gap-3 p-3">
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="truncate text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">
                    登録: {dateFormat.format(p.createdAt)}
                    {p.lastUsedAt &&
                      ` / 最終利用: ${dateFormat.format(p.lastUsedAt)}`}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    {p.backedUp ? (
                      <>
                        <Cloud className="size-3.5" />
                        クラウドに同期されています
                      </>
                    ) : (
                      <>
                        <Smartphone className="size-3.5" />
                        この端末のみ（端末を失くすと使えません）
                      </>
                    )}
                  </p>
                </div>
                <PasskeyDeleteButton id={p.id} label={label} />
              </li>
            );
          })}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-bold">パスキーを追加する</h2>
        <PasskeyRegisterForm mode="add" />
      </section>

      <form action={logout}>
        <LogoutButton />
      </form>
    </>
  );
}
