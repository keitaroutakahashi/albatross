import {
  LoadingStatus,
  Skeleton,
  SkeletonRows,
} from "@/app/_components/ui/skeleton";

/** 管理画面の一覧・編集画面の読み込み中。ページ見出しと一覧の形を示す */
export const ListSkeleton = () => (
  <LoadingStatus>
    <div className="flex items-center gap-2 border-b px-4 py-3">
      <Skeleton className="h-7 w-32" />
    </div>
    <SkeletonRows />
  </LoadingStatus>
);
