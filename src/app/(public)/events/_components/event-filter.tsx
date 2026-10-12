import { getSeasons } from "@/app/_features/seasons/api/get-seasons";
import { getCurrentSeason } from "@/app/_utils/date/date";
import { EventFilterSelector } from "@/app/(public)/events/_components/event-filter-selector";

export async function EventFilter() {
  const defaultSeason = getCurrentSeason();
  const seasons = await getSeasons();

  return (
    <EventFilterSelector seasons={seasons} defaultSeason={defaultSeason} />
  );
}
