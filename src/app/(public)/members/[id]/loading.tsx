import { PageTitle } from "@/app/_components/ui/page-title";
import {
  LoadingStatus,
  Skeleton,
  SkeletonTable,
} from "@/app/_components/ui/skeleton";

/** 選手ページの読み込み中。タイトルはそのまま出し、プロフィールと成績の形を示す */
export default function Loading() {
  return (
    <>
      <PageTitle title="MEMBERS" subtitle="メンバー" />
      <LoadingStatus>
        <div className="py-6 px-3 flex flex-col gap-y-12">
          <div className="flex items-center gap-4">
            <Skeleton className="size-24 shrink-0 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
          <SkeletonTable rows={6} />
        </div>
      </LoadingStatus>
    </>
  );
}
