import { ChevronRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

type Props<T extends string> = {
  href: Route<T>;
  title: ReactNode;
  description?: ReactNode;
  /** タイトル右側のバッジ等 */
  trailing?: ReactNode;
};

export const ListCard = <T extends string>({
  href,
  title,
  description,
  trailing,
}: Props<T>) => {
  return (
    <li>
      <Link
        href={href}
        className="flex min-h-14 items-center gap-3 border-b px-4 py-3 active:bg-accent"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{title}</p>
          {description && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {trailing}
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      </Link>
    </li>
  );
};
