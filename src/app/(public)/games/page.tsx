import { PageTitle } from "@/app/_components/ui/pageTitle";
import { Suspense } from "react";

import { GameList } from "./_components/gameList";
import { SeasonSelector } from "./_components/seasonSelector";
import { getSeasons } from "./_data/getSeasons";

export default async function Page() {
  const seasons = await getSeasons();

  // 最新シーズン（yearが最大）をデフォルトに設定
  const defaultSeason = seasons[0];

  return (
    <div>
      <PageTitle title="GAME" subtitle="試合情報" />
      <div className="flex items-center">
        {seasons.length > 0 && defaultSeason ? (
          <Suspense fallback={<div className="w-30 h-10" />}>
            <SeasonSelector
              seasons={seasons}
              defaultYear={defaultSeason.year}
            />
          </Suspense>
        ) : (
          <p className="text-gray-500">シーズンデータがありません</p>
        )}
      </div>

      <div className="md:max-w-4xl md:mx-auto px-5">
        <GameList />
      </div>
    </div>
  );
}
