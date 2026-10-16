import { ChevronLeft, Plus } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { Button } from "@/app/_components/shadcn/button";

type Props<B extends string, A extends string> = {
  title: string;
  /** 戻り先。トップ以外では必ず指定する */
  backHref?: Route<B>;
  /** 指定すると右側に「追加」ボタンを表示する */
  addHref?: Route<A>;
};

export const PageHeader = <B extends string, A extends string>({
  title,
  backHref,
  addHref,
}: Props<B, A>) => {
  return (
    <div className="flex items-center gap-2 border-b bg-background px-4 py-3">
      {backHref && (
        <Link
          href={backHref}
          aria-label="戻る"
          className="-ml-2 flex size-10 shrink-0 items-center justify-center rounded-md hover:bg-accent"
        >
          <ChevronLeft className="size-5" />
        </Link>
      )}
      <h1 className="min-w-0 flex-1 truncate text-lg font-bold">{title}</h1>
      {addHref && (
        <Button asChild size="lg">
          <Link href={addHref}>
            <Plus />
            追加
          </Link>
        </Button>
      )}
    </div>
  );
};
