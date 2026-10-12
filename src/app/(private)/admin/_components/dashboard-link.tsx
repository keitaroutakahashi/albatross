import { ChevronRight, type LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

type Props<T extends string> = {
  href: Route<T>;
  icon: LucideIcon;
  label: string;
  /** 名前だけでは伝わらない項目にだけ付ける */
  description?: string;
  /** 登録済みの数（単位付き。例: "12人"） */
  count: string;
};

export const DashboardLink = <T extends string>({
  href,
  icon: Icon,
  label,
  description,
  count,
}: Props<T>) => {
  return (
    <li className="border-b last:border-b-0">
      <Link
        href={href}
        className="flex min-h-16 items-center gap-3 px-4 py-3 transition-colors hover:bg-accent active:bg-accent"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="size-6" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base font-bold">{label}</span>
          {description && (
            <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">
              {description}
            </span>
          )}
        </span>
        <span className="shrink-0 text-right text-sm text-muted-foreground">
          {count}
        </span>
        <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
      </Link>
    </li>
  );
};
