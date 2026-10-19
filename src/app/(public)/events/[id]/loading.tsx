import {
  LoadingStatus,
  Skeleton,
  SkeletonSection,
} from "@/app/_components/ui/skeleton";

/** イベント詳細の読み込み中。ヘッダー・スコアボード・各セクションの形に合わせる */
export default function Loading() {
  return (
    <LoadingStatus>
      <div className="px-2 pt-4">
        <Skeleton className="mx-auto h-4 w-32" />
        <Skeleton className="mx-auto mt-3 h-6 w-3/4" />
      </div>
      <div className="px-3 py-6 flex flex-col gap-y-10">
        <Skeleton className="h-28 w-full" />
        <SkeletonSection />
        <SkeletonSection />
        <SkeletonSection blocks={2} />
      </div>
    </LoadingStatus>
  );
}
