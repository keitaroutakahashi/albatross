import type { PracticeDetail } from "@/app/_features/events/api/get-events";
import { PracticeHeader } from "@/app/(public)/practices/[id]/_components/practice-header";
import { PracticeInfo } from "@/app/(public)/practices/[id]/_components/practice-info";
import { PracticeOverview } from "@/app/(public)/practices/[id]/_components/practice-overview";

type Props = {
  practice: PracticeDetail;
};

export const Root = ({ practice }: Props) => {
  return (
    <div>
      <PracticeHeader practice={practice} />
      <div className="mt-4" />
      <PracticeOverview practice={practice} />
      <div className="@content:max-w-5xl @content:mx-auto px-3 @content:px-5 py-6 flex flex-col @content:gap-y-14 gap-y-10">
        <PracticeInfo practice={practice} />
      </div>
    </div>
  );
};
