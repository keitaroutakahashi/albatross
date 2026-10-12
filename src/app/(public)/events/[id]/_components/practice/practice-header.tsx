import type { PracticeDetail } from "@/app/_features/events/api/get-events";
import {
  formatAsDayName,
  formatAsFullDate,
  formatAsTime24,
} from "@/app/_utils/date/date";

type Props = {
  practice: PracticeDetail;
};

export const PracticeHeader = ({ practice }: Props) => {
  const { date } = practice.event;

  return (
    <div className="px-2">
      <p className="text-center font-bold text-sm @content:text-base">練習</p>
      <div className="mt-3"></div>
      <p className="text-center font-bold text-base @content:text-2xl">
        {formatAsFullDate(date)} ({formatAsDayName(date)}){" "}
        {formatAsTime24(date)}
      </p>
    </div>
  );
};
