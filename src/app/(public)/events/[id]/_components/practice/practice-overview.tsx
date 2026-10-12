import type { PracticeDetail } from "@/app/_features/events/api/get-events";
import { getPracticeStatusText } from "@/app/_features/events/utils/get-practice-status-text";
import { OverviewBackground } from "@/app/(public)/events/[id]/_components/overview-background";

type Props = {
  practice: PracticeDetail;
};

export const PracticeOverview = ({ practice }: Props) => {
  return (
    <div className="relative py-14 @content:py-20">
      <OverviewBackground imagePath={practice.ground?.imagePath} />
      <div className="relative flex flex-col items-center justify-center gap-y-4 text-white">
        <p className="font-bold text-sm @content:text-base text-center">
          [ {getPracticeStatusText(practice.event.status)} ]
        </p>
        <p className="text-4xl @content:text-7xl font-bold tracking-wider">
          練習
        </p>
      </div>
    </div>
  );
};
