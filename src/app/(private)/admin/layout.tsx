import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminHeader } from "@/app/(private)/admin/_components/admin-header";
import { requireAdminEntry } from "@/app/(private)/admin/_utils/auth";

export const metadata: Metadata = {
  title: {
    template: "%s | Albatross 管理",
    default: "Albatross 管理",
  },
  robots: { index: false, follow: false },
};

export default async function Layout({ children }: { children: ReactNode }) {
  await requireAdminEntry();

  return (
    <>
      <AdminHeader />
      <div className="@container mx-auto max-w-3xl">
        <main className="min-h-[calc(100dvh-3.5rem)] pb-24">{children}</main>
      </div>
    </>
  );
}
