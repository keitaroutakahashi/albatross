import { getSeasons } from "@/app/_features/seasons/api/getSeasons";
import { getCurrentSeason } from "@/app/_utils/date/date";
import { SeasonSelector } from "@/app/(public)/games/_components/seasonSelector";

export async function SeasonFilter() {
  const defaultSeason = getCurrentSeason();
  const seasons = await getSeasons();

  return <SeasonSelector seasons={seasons} defaultSeason={defaultSeason} />;
}
