"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/shadcn/select";
import type { SeasonModel } from "@/generated/prisma/models/Season";

type Props = {
  seasons: SeasonModel[];
  defaultSeason: string;
};

export function SeasonSelector({ seasons, defaultSeason }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSeason = searchParams.get("season") ?? String(defaultSeason);

  const handleSeasonChange = (season: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("season", season);
    router.push(`/games?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={currentSeason} onValueChange={handleSeasonChange}>
        <SelectTrigger className="w-30">
          <SelectValue placeholder="年度を選択" />
        </SelectTrigger>
        <SelectContent>
          {seasons.map((season) => (
            <SelectItem key={season.id} value={String(season.season)}>
              {season.season}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="font-bold">年度</span>
    </div>
  );
}
