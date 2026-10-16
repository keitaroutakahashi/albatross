import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth/current-user";

export const metadata: Metadata = {
  title: {
    template: "%s | Albatross",
    default: "アカウント | Albatross",
  },
  robots: { index: false, follow: false },
};

export default async function Layout({ children }: { children: ReactNode }) {
  await requireUser();

  return (
    <div className="mx-auto max-w-3xl">
      <header className="flex items-center gap-2 border-b px-4 py-3">
        <Link
          href="/admin"
          aria-label="管理画面に戻る"
          className="-ml-2 flex size-10 items-center justify-center rounded-md hover:bg-accent"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="text-lg font-bold">アカウント</h1>
      </header>
      <main className="flex flex-col gap-8 p-4 pb-24">{children}</main>
    </div>
  );
}
