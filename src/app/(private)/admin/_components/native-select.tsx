import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * ブラウザ標準の矢印は右端に張り付くため、appearance を外して
 * アイコンを余白つきで重ねる。モバイルでは OS 標準のピッカーがそのまま開く。
 */
export const NativeSelect = ({
  className,
  children,
  ...props
}: ComponentProps<"select">) => (
  <div className="relative w-full min-w-0">
    <select
      {...props}
      className={cn(
        "h-11 w-full appearance-none rounded-md border border-input bg-transparent pr-10 pl-3 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive md:text-sm",
        className,
      )}
    >
      {children}
    </select>
    <ChevronDown
      aria-hidden
      className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
    />
  </div>
);
