import { PageTitle } from "@/app/_components/ui/page-title";
import {
  LoadingStatus,
  Skeleton,
  SkeletonTable,
} from "@/app/_components/ui/skeleton";

/** 投手成績の読み込み中。タイトルはそのまま出し、フィルターと表の形を示す */
export default function Loading() {
  return (
    <>
      <PageTitle title="PITCHING STATS" subtitle="投手成績" />
      <LoadingStatus>
        <div className="py-6 px-3 flex flex-col gap-y-6">
          <Skeleton className="h-10 w-full" />
          <SkeletonTable />
        </div>
      </LoadingStatus>
    </>
  );
}
