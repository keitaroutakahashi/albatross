import { clsx } from "clsx";
import {
  formatAsMDWithColon,
  formatAsYYYY,
  formatToShortDayNameEn,
  getDayOfWeek,
} from "@/app/_utils/date/date";

type Props = {
  date: Date;
  label: string;
};

export const EventCardHeader = ({ date, label }: Props) => {
  const dayOfWeek = getDayOfWeek(date);

  return (
    <div className="bg-gray-100 p-3 @content:p-4 flex @content:flex-col @content:w-64 justify-between items-center">
      <div className="flex items-center gap-x-1">
        <p className="text-3xl font-bold font-(family-name:--font-roboto)">
          {formatAsMDWithColon(date)}
        </p>
        <div className="">
          <p
            className={clsx("text-xs font-bold", {
              "text-red-400": dayOfWeek === 0,
              "text-blue-400": dayOfWeek === 6,
              "text-gray-500": dayOfWeek !== 0 && dayOfWeek !== 6,
            })}
          >
            {formatToShortDayNameEn(date)}
          </p>
          <p className="text-xs font-bold font-(family-name:--font-roboto)">
            {formatAsYYYY(date)}
          </p>
        </div>
      </div>
      <p className="font-bold text-sm">{label}</p>
    </div>
  );
};
