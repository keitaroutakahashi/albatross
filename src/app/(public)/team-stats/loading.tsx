import { PageTitle } from "@/app/_components/ui/page-title";
import {
  LoadingStatus,
  Skeleton,
  SkeletonTable,
} from "@/app/_components/ui/skeleton";

/** チーム成績の読み込み中。タイトルはそのまま出し、年度選択と表の形を示す */
export default function Loading() {
  return (
    <>
      <PageTitle title="TEAM STATS" subtitle="チーム成績" />
      <LoadingStatus>
        <div className="py-6 px-3 flex flex-col gap-y-6">
          <Skeleton className="h-10 w-full md:w-60" />
          <SkeletonTable rows={6} />
        </div>
      </LoadingStatus>
    </>
  );
}
