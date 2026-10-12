"use client";

import { ErrorScreen } from "@/app/_components/ui/error-screen";
import { PublicShell } from "@/app/_components/ui/public-shell";

export default function ErrorPage() {
  return (
    <PublicShell>
      <ErrorScreen title="エラーが発生しました 🥲" />
    </PublicShell>
  );
}
