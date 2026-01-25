"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/shadcn/select";
import type { Season } from "../_data/getSeasons";

type Props = {
  seasons: Season[];
  defaultYear: number;
};

export function SeasonSelector({ seasons, defaultYear }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentYear = searchParams.get("year") ?? String(defaultYear);

  const handleYearChange = (year: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", year);
    router.push(`/games?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={currentYear} onValueChange={handleYearChange}>
        <SelectTrigger className="w-30">
          <SelectValue placeholder="年度を選択" />
        </SelectTrigger>
        <SelectContent>
          {seasons.map((season) => (
            <SelectItem key={season.id} value={String(season.year)}>
              {season.year}年
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span>年度</span>
    </div>
  );
}
