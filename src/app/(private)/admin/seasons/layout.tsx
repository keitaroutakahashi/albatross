import type { ReactNode } from "react";
import { requireAccess } from "@/app/(private)/admin/_utils/auth";

/** この機能を使えないロールには、配下のページを存在しないものとして扱う */
export default async function Layout({ children }: { children: ReactNode }) {
  await requireAccess("options");
  return children;
}
