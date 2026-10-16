import { getEvents } from "@/app/_features/events/api/get-events";
import { EventCard } from "@/app/_features/events/components/event-card";
import { parseEventType } from "@/app/_features/events/utils/event-type";
import { getCurrentSeason } from "@/app/_utils/date/date";

type Props = {
  season?: string;
  type?: string;
};

export const EventList = async ({ season, type }: Props) => {
  const defaultSeason = getCurrentSeason();

  const events = await getEvents({
    season: season ?? defaultSeason,
    type: parseEventType(type),
  });

  if (events.length === 0) {
    return <p className="text-center text-sm text-gray-500">記録なし</p>;
  }

  return (
    <ul className="space-y-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </ul>
  );
};
