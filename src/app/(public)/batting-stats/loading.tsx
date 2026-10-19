import { PageTitle } from "@/app/_components/ui/page-title";
import {
  LoadingStatus,
  Skeleton,
  SkeletonTable,
} from "@/app/_components/ui/skeleton";

/** 打者成績の読み込み中。タイトルはそのまま出し、フィルターと表の形を示す */
export default function Loading() {
  return (
    <>
      <PageTitle title="BATTING STATS" subtitle="打者成績" />
      <LoadingStatus>
        <div className="py-6 px-3 flex flex-col gap-y-6">
          <Skeleton className="h-10 w-full" />
          <SkeletonTable />
        </div>
      </LoadingStatus>
    </>
  );
}
