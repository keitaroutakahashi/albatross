import Link from "next/link";
import { EventCardHeader } from "@/app/_features/events/components/event-card-header";
import type { EventModel } from "@/generated/prisma/models/Event";
import type { GroundModel } from "@/generated/prisma/models/Ground";

type Props = {
  event: EventModel;
  practice: { ground: GroundModel | null; groundCourt: string | null };
};

export const PracticeCard = ({ event, practice }: Props) => {
  return (
    <li>
      <Link
        href={`/events/${event.id}`}
        className="flex flex-col @content:flex-row border border-gray-300 rounded overflow-hidden hover:border-black transition cursor-pointer"
      >
        <EventCardHeader date={event.date} label="練習" />
        <div className="flex flex-col items-center justify-center gap-y-2 p-3 @content:px-10 @content:flex-1">
          <p className="text-xs @content:text-sm font-bold text-center">
            {practice.ground
              ? [practice.ground.name, practice.groundCourt]
                  .filter(Boolean)
                  .join(" ")
              : "会場未定"}
          </p>
          {event.status === "canceled" && (
            <>
              <p className="text-sm font-bold">中止</p>
              {event.cancelReason && (
                <p className="text-xs text-gray-500">{event.cancelReason}</p>
              )}
            </>
          )}
        </div>
      </Link>
    </li>
  );
};
