import type { ReactNode } from "react";
import { PublicShell } from "@/app/_components/ui/public-shell";

export default function Layout({ children }: { children: ReactNode }) {
  return <PublicShell>{children}</PublicShell>;
}
