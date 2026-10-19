import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
};

/** 読み込み中の場所を示す灰色のブロック。大きさは className で指定する */
export const Skeleton = ({ className }: SkeletonProps) => (
  <div
    aria-hidden
    className={cn("rounded-md bg-muted motion-safe:animate-pulse", className)}
  />
);

type LoadingStatusProps = {
  children: ReactNode;
  label?: string;
};

/** スケルトンをまとめる枠。スクリーンリーダーには「読み込み中」とだけ伝える */
export const LoadingStatus = ({
  children,
  label = "読み込み中",
}: LoadingStatusProps) => (
  <div role="status" aria-live="polite" aria-busy="true">
    <span className="sr-only">{label}</span>
    {children}
  </div>
);

type RowsProps = {
  count?: number;
};

/** 管理画面の一覧（ListCard）の形をしたスケルトン */
export const SkeletonRows = ({ count = 8 }: RowsProps) => (
  <ul>
    {Array.from({ length: count }, (_, i) => (
      <li
        // biome-ignore lint/suspicious/noArrayIndexKey: 固定の見た目だけの並びで、順序は変わらない
        key={i}
        className="flex min-h-14 items-center gap-3 border-b px-4 py-3"
      >
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-3/4" />
        </div>
        <Skeleton className="size-4" />
      </li>
    ))}
  </ul>
);

type TableProps = {
  rows?: number;
};

/** 成績表の形をしたスケルトン。見出しの行と、行ごとの名前・数値の列を並べる */
export const SkeletonTable = ({ rows = 10 }: TableProps) => (
  <div className="space-y-2">
    <Skeleton className="h-9 w-full" />
    {Array.from({ length: rows }, (_, i) => (
      <div
        // biome-ignore lint/suspicious/noArrayIndexKey: 固定の見た目だけの並びで、順序は変わらない
        key={i}
        className="flex items-center gap-3 px-1 py-1"
      >
        <Skeleton className="h-4 w-6" />
        <Skeleton className="h-4 w-24" />
        <div className="flex flex-1 justify-end gap-3">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-8" />
        </div>
      </div>
    ))}
  </div>
);

type SectionProps = {
  /** ブロックの数 */
  blocks?: number;
};

/** 見出しと、中身のブロックを並べたセクションのスケルトン */
export const SkeletonSection = ({ blocks = 3 }: SectionProps) => (
  <section className="space-y-3">
    <Skeleton className="h-6 w-32" />
    {Array.from({ length: blocks }, (_, i) => (
      <Skeleton
        // biome-ignore lint/suspicious/noArrayIndexKey: 固定の見た目だけの並びで、順序は変わらない
        key={i}
        className="h-12 w-full"
      />
    ))}
  </section>
);
