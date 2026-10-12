import Image from "next/image";
import type { PracticeDetail } from "@/app/_features/events/api/get-events";
import { getPracticeStatusText } from "@/app/_features/events/utils/get-practice-status-text";

type Props = {
  practice: PracticeDetail;
};

export const PracticeOverview = ({ practice }: Props) => {
  return (
    <div className="relative py-14 @content:py-20">
      <Image
        src="/images/game/bg-overview.jpg"
        alt=""
        fill
        className="object-cover object-center brightness-20"
        priority
      />
      <div className="relative flex flex-col items-center justify-center gap-y-4 text-white">
        <p className="font-bold text-sm @content:text-base text-center">
          [ {getPracticeStatusText(practice.event.status)} ]
        </p>
        <p className="text-4xl @content:text-7xl font-bold tracking-wider">
          練習
        </p>
        <p className="font-bold text-sm @content:text-base text-center">
          {practice.ground?.name ?? "会場未定"}
        </p>
      </div>
    </div>
  );
};
