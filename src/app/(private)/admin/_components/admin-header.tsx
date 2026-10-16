import { CircleUser, ExternalLink, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export const AdminHeader = () => {
  return (
    <header className="sticky top-0 z-40 bg-primary text-primary-foreground">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link
          href="/admin"
          className="flex items-center gap-2 text-base font-bold"
        >
          <LayoutDashboard className="size-5" />
          Albatross 管理
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1 text-xs text-primary-foreground/80"
          >
            公開サイト
            <ExternalLink className="size-3.5" />
          </Link>
          <Link
            href="/account"
            aria-label="アカウント"
            className="flex size-9 items-center justify-center rounded-md text-primary-foreground/80 hover:bg-primary-foreground/10"
          >
            <CircleUser className="size-5" />
          </Link>
        </nav>
      </div>
    </header>
  );
};
