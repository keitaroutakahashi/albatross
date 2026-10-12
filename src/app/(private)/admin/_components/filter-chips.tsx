import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Chip = {
  label: string;
  href: ComponentProps<typeof Link>["href"];
  active: boolean;
};

export const FilterChips = ({ chips }: { chips: Chip[] }) => {
  return (
    <ul className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
      {chips.map((chip) => (
        <li key={chip.label} className="shrink-0">
          <Link
            href={chip.href}
            aria-current={chip.active ? "true" : undefined}
            className={cn(
              "flex h-9 items-center rounded-full border px-4 text-sm",
              chip.active
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-background",
            )}
          >
            {chip.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};
